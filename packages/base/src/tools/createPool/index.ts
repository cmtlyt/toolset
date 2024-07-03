import { EMPTY } from '@com/constant';

import { getRandomString } from '@/utils';

interface PoolItem<T> {
  __id: string;
  /**
   * ### 不建议对该属性进行解构和赋值，会影响管理
   *
   * ```
   * // 赋值（不建议！！！）
   * const data = item.data
   * // 解构（不建议！！！）
   * const { data } = item
   * ```
   */
  data: T;
}

interface StoreItem<T> {
  data: () => T;
  unUse: () => void;
}

interface WaitingItem<T> {
  resolve: (item: StoreItem<T>) => void;
  reject: (reason?: any) => void;
}

const poolMap: TObject<Pool<any>> = {};

class Pool<T> {
  static getPool<T>(poolId: string | symbol = '', size = 5, initFunction?: (idx: number) => T) {
    const initFunc = initFunction || (() => EMPTY);
    if (!poolId) return new Pool<T>(size, initFunc, poolId);
    return (poolMap[poolId] ??= new Pool<T>(size, initFunc, poolId));
  }

  #_poolId: string | symbol;
  #_pool: PoolItem<T>[];
  #_waiting: WaitingItem<T>[];
  #_closeCallback: (data: any) => void;

  usableCount: number;
  isClose: boolean;

  constructor(size = 5, initFunction: (idx: number) => any = () => EMPTY, poolId: string | symbol = Symbol()) {
    this.#_poolId = poolId;
    this.#_pool = Array.from({ length: size }, (_, i) => this.#_genItem(initFunction(i)));
    this.#_waiting = [];
    this.usableCount = this.#_pool.reduce((prev, cur) => {
      if (cur.data !== EMPTY) prev++;
      return prev;
    }, 0);
    this.isClose = false;
    this.#_closeCallback = () => {};
  }

  #_genItem(data: T): PoolItem<T> {
    return { data, __id: getRandomString(32) };
  }
  #_putItem(data: T, index: number = null) {
    if (this.isClose) {
      this.#_closeCallback(data);
      throw new Error('池子已关闭');
    }
    // 返还
    if (typeof index === 'number') {
      const item = this.#_pool[index];
      item.data = data;
      item.__id = getRandomString(32);
    } else {
      // 添加
      const index = this.#_pool.findIndex((item) => item.data === EMPTY);
      if (!~index) throw new Error('池子已满');
      this.#_pool[index] = this.#_genItem(data);
    }
    ++this.usableCount;
  }
  async #_genReturn(index: number): Promise<StoreItem<T>> {
    if (this.isClose) throw new Error('池子已关闭');
    const item = this.#_pool[index];
    // 如果不存在，则等待
    if (!item || item.data === EMPTY) {
      return new Promise((resolve, reject) => {
        this.#_waiting.push({ resolve, reject });
      });
    }
    const { data, __id } = item;

    const canIUse = () => {
      if (this.isClose) {
        this.#_putItem(data, index);
        throw new Error('池子已关闭');
      }
      if (__id !== item.__id) throw new Error('数据已被返还');
    };
    const unUse = () => {
      this.#_putItem(data, index);
    };

    --this.usableCount;

    const dataHandler = function () {
      if (this !== itemHandler) return;
      canIUse();
      return data;
    };

    const unUseHandler = function () {
      if (this !== itemHandler) return;
      canIUse();
      return unUse();
    };

    const itemHandler = {
      data() {
        return dataHandler.call(this);
      },
      unUse() {
        return unUseHandler.call(this);
      },
    };

    return Promise.resolve(itemHandler);
  }

  put(data: T) {
    this.#_putItem(data);
    // 如果存在等待队列，则取出第一个
    if (this.#_waiting.length) {
      const { resolve } = this.#_waiting.shift();
      this.get().then((item) => {
        resolve(item);
      });
    }
  }
  async get() {
    const index = this.#_pool.findIndex((item) => item.data !== EMPTY);
    return this.#_genReturn(index);
  }
  close(callback: (data: T) => void) {
    this.#_pool.forEach(({ data }) => callback(data));
    this.#_pool = [];
    this.#_waiting = [];
    this.usableCount = 0;
    this.isClose = true;
    this.#_closeCallback = callback;
    delete poolMap[this.#_poolId];
  }
}

export type PoolType<T = any> = Pool<T>;

export function createPool<T>(initFunction: (idx: number) => T, size = 5, poolId?: string | symbol): PoolType<T> {
  return Pool.getPool<T>(poolId, size, initFunction);
}

export function getPool<T>(poolId: string | symbol = ''): PoolType<T> {
  return Pool.getPool(poolId);
}
