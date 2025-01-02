import type { GetFunctorResult } from './utils';
import { INTERNAL_EMPTY } from '$/common/constant';
import { isPromise, withResolvers } from '$/utils';
import { Functor, getState, setState } from './utils';

interface Resolver<T> {
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}

type TaskHandler<T> = ((resolver: Resolver<T>) => void) | (() => Promise<T>);

type MapValue<T extends TaskHandler<any>> = T extends TaskHandler<infer R> ? Awaited<R> : never;

interface ListenOptions<T extends TaskHandler<any>> {
  onResolved?: (result: MapValue<T>) => any;
  onRejected?: (reason?: any) => any;
}

interface ListenState<T extends TaskHandler<any>> {
  onResolveds: Required<ListenOptions<T>>['onResolved'][];
  onRejecteds: Required<ListenOptions<T>>['onRejected'][];
}

interface TaskState<T extends TaskHandler<any>> {
  value: T;
  listen?: ListenState<T>;
  result?: MapValue<T>;
  error?: any;
  status?: 'running' | 'finished';
}

type ThenResult<T, D> = T extends (...args: any[]) => infer R ? R : D;

class Task<T extends TaskHandler<any>> extends Functor<T> {
  name = 'Task';

  constructor(value: T) {
    super(value);
    setState(this, { value });
  }

  async #runCallback<R>(
    callback: ((value: MapValue<T>) => R) | TaskHandler<R>,
    resolver: Resolver<R>,
    // 使用 EMPTY 是为了安全考虑, 否则如果 value 是 undefined 的话 value 会被意外的赋值
    value: MapValue<T> | typeof INTERNAL_EMPTY,
  ): Promise<void> {
    // 如果传入的是 EMPTY 则说明是 task 的执行体, 应该由用户控制是否完成
    const _value: any = value === INTERNAL_EMPTY ? resolver : value;
    try {
      // 包裹 callback 是为了捕获 callback 同步错误
      const result = callback(_value);
      if (isPromise(result))
        // 如果是 promise 则交由 then 处理错误
        result.then(resolver.resolve, resolver.reject);
      else if (value !== INTERNAL_EMPTY)
        // map 方法传入的值需要系统主动 resolve
        resolver.resolve(result as any);
    }
    catch (e) {
      resolver.reject(e);
    }
  }

  map<R>(fn: (value: MapValue<T>) => R): Task<TaskHandler<R>> {
    return task<R>((resolver) => {
      const handler = this.valueOf();
      const newResolver = {
        reject: resolver.reject,
        resolve: (value: MapValue<T>) => {
          this.#runCallback(fn, resolver, value);
        },
      };
      // 处理 task 方法传入的异步函数
      this.#runCallback(handler, newResolver, INTERNAL_EMPTY);
      // const result = handler(newResolver);
      // if (isPromise(result)) {
      //   result.then(newResolver.resolve, newResolver.reject);
      // }
    });
  }

  flatMap<C extends Functor<any>, R = GetFunctorResult<C>>(
    fn: (value: MapValue<T>) => C,
  ): Task<TaskHandler<R>> {
    return this.map((v: any) => fn(v).valueOf());
  }

  then<F extends ListenOptions<T>['onResolved'], R = ThenResult<F, MapValue<T>>>(
    onResolved?: F,
    onRejected?: ListenOptions<T>['onRejected'],
  ): Promise<R> {
    const { promise, resolve, reject } = withResolvers<R>();

    const resolver: ListenOptions<T> = { onResolved: (v) => {
      try {
        onResolved ? resolve(onResolved(v)) : resolve(v);
      }
      catch (err) {
        reject(err);
      }
    }, onRejected: (e) => {
      try {
        onRejected ? resolve(onRejected(e)) : reject(e);
      }
      catch (err) {
        reject(err);
      }
    } };

    this.listen(resolver).run();
    return promise;
  }

  catch<F extends ListenOptions<T>['onRejected']>(
    onRejected?: F,
  ): Promise<ThenResult<F, void>> {
    return this.then(void 0, onRejected);
  }

  #genetateResolver() {
    const resolve = (value: MapValue<T>) => {
      setState(this, { result: value, status: 'finished' });
      this.#success();
    };
    const reject = (reason?: any) => {
      setState(this, { error: reason, status: 'finished' });
      this.#fail();
    };
    return { resolve, reject };
  }

  run() {
    const { status } = getState<TaskState<T>>(this);
    if (status)
      return this;
    setState(this, { status: 'running' });
    const resolver = this.#genetateResolver();
    this.#runCallback(this.valueOf(), resolver, INTERNAL_EMPTY);
    // const result = this.valueOf()(resolver);
    // // 创建完之后直接执行 task
    // if (isPromise(result)) {
    //   result.then(resolver.resolve, resolver.reject);
    // }
    return this;
  }

  #fail() {
    const { listen, error } = getState<TaskState<T>>(this);

    // 防止传入异步函数后重复调用
    if (!listen)
      return;

    error && listen.onRejecteds.forEach(cb => cb(error));
    setState(this, { listen: void 0, error: void 0 });
  }

  #success() {
    const { listen, result } = getState<TaskState<T>>(this);

    // 防止传入异步函数后重复调用
    if (!listen)
      return;

    result && listen.onResolveds.forEach(cb => cb(result));
    setState(this, { listen: void 0 });
  }

  listen(options: ListenOptions<T>) {
    const state = getState<TaskState<T>>(this);
    let { listen, result, error, status } = state;
    const { onRejected, onResolved } = options;

    // 如果任务已经完成，直接执行回调
    if (status === 'finished') {
      if (error) {
        if (!onRejected)
          throw error;
        onRejected(error);
        setState(this, { error: void 0 });
      }
      result && onResolved && onResolved(result);
      return this;
    }

    if (!listen) {
      listen = { onResolveds: [], onRejecteds: [] };
    }

    onResolved && listen.onResolveds.push(onResolved);
    onRejected && listen.onRejecteds.push(onRejected);

    setState(this, { listen });

    return this;
  }
}

export function task<T>(handler: TaskHandler<T>) {
  return new Task(handler);
}
