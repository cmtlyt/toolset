import type { TAnyFunc, TGetArgs, TGetReturnType } from '$/types/base';
import { INTERNAL_EMPTY } from '$/common/constant';

/**
 * 将函数转为只执行一次的函数, 后续调用将返回第一次调用的结果
 *
 * 单纯缓存函数返回结果, 如果返回值为函数, 并且希望直接调用则使用 `cacheByReturn`
 */
export function onceFunc<T extends TAnyFunc>(func: T): T {
  let result: ReturnType<T> | symbol = INTERNAL_EMPTY;
  return function (...args) {
    if (result !== INTERNAL_EMPTY)
      return result;
    return (result = func(...args));
  } as T;
}

/**
 * 将函数转为只执行一次的函数, 后续调用将返回第一次调用的结果
 *
 * @alias onceFunc
 */
export const cacheReturnValue = onceFunc;

class MemoizeMap {
  #_map = new Map();
  #_weakMap = new WeakMap();

  #_isObject(key: any) {
    return typeof key === 'object' && key !== null;
  }

  set(key: any, value: any) {
    if (this.#_isObject(key)) {
      this.#_weakMap.set(key, value);
    }
    else {
      this.#_map.set(key, value);
    }
  }

  get(key: any) {
    if (this.#_isObject(key)) {
      return this.#_weakMap.get(key);
    }
    return this.#_map.get(key);
  }

  has(key: any) {
    if (this.#_isObject(key)) {
      return this.#_weakMap.has(key);
    }
    return this.#_map.has(key);
  }
}

/**
 * 将函数专为带缓存的函数
 *
 * @warning 缓存的 key 默认为第一个参数, 如果需要自定义缓存参数, 请传入 resolver 函数
 */
export function memoize<F extends (...args: any[]) => any>(func: F, resolver?: (...args: TGetArgs<F>) => any) {
  const memoized = function (...args: TGetArgs<F>): TGetReturnType<F> {
    const key = resolver ? resolver(...args) : args[0];
    const cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
  memoized.cache = new MemoizeMap();
  return memoized;
}

/**
 * 缓存函数执行结果
 *
 * 如果执行结果为函数, 则会调用函数
 *
 * 如果执行结果为非函数, 则返回执行结果
 *
 * 使用场景: 缓存的是函数, 并且每次都需要调用函数, 如果单纯为了缓存返回值, 请使用 `cacheReturnValue` 或 `onceFunc`
 */
export const cacheByReturn: <T extends () => any, R = ReturnType<T>>(
  cacheLoad: T,
) => (...args: TGetArgs<R>) => TGetReturnType<R> = (() => {
  if (Reflect?.apply) {
    return (cacheLoad) => {
      let cache: any = INTERNAL_EMPTY;
      return (...args) => {
        if (cache === INTERNAL_EMPTY)
          cache = cacheLoad();
        if (typeof cache !== 'function')
          return cache;
        return Reflect.apply(cache, null, args);
      };
    };
  }
  return (cacheLoad) => {
    let cache: any = INTERNAL_EMPTY;
    return (...args) => {
      if (cache === INTERNAL_EMPTY)
        cache = cacheLoad();
      if (typeof cache !== 'function')
        return cache;
      return cache(...args);
    };
  };
})();
