import type { PromiseValue } from '$/types/base';
import type { GetFunctorResult } from './utils';
import { compose, isPromise } from '$/utils';
import { Functor, getState, setState } from './utils';

interface Resolver<T> {
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}

type TaskHandler<T> = ((resolver: Resolver<T>) => void) | (() => Promise<T>);

type MapValue<T extends TaskHandler<any>> = T extends TaskHandler<infer R> ? PromiseValue<R> : never;

interface ListenOptions<T extends TaskHandler<any>> {
  onResolved?: (result: MapValue<T>) => void;
  onRejected?: (reason?: any) => void;
}

interface ListenState<T extends TaskHandler<any>> {
  onResolveds: Required<ListenOptions<T>>['onResolved'][];
  onRejecteds: Required<ListenOptions<T>>['onRejected'][];
}

class Task<T extends TaskHandler<any>> extends Functor<T> {
  name = 'Task';

  constructor(value: T) {
    super(value);
    setState(this, { value });
  }

  map<R>(fn: (value: MapValue<T>) => R): Task<TaskHandler<R>> {
    const newTask = task<R>((resolver) => {
      const handler = this.valueOf();
      handler({
        reject: resolver.reject,
        resolve: compose(resolver.resolve, fn),
      });
    });
    // 同步当前 task 的 state 到新 task
    const state = getState(this);
    setState(newTask, { ...state, value: newTask.valueOf() });
    return newTask;
  }

  flatMap<C extends Functor<any>, R = GetFunctorResult<C>>(fn: (value: MapValue<T>) => C): Task<TaskHandler<R>> {
    return this.map((v: any) => fn(v).join()) as any;
  }

  then(onResolved: ListenOptions<T>['onResolved'], onRejected?: ListenOptions<T>['onRejected']) {
    return this.listen({ onResolved, onRejected }).run();
  }

  run() {
    const state = getState<{ listen?: ListenState<T> }>(this);
    const { listen } = state;
    const resolve = (value: MapValue<T>) => {
      setState(this, { ...state, result: value });
      // 防止传入异步函数后重复调用
      if (!listen || typeof value === 'undefined')
        return;
      listen.onResolveds.forEach(cb => cb(value));
    };
    const reject = (reason?: any) => {
      setState(this, { ...state, error: reason });
      // 防止传入异步函数后重复调用
      if (!listen || typeof reason === 'undefined')
        return;
      listen.onRejecteds.forEach(cb => cb(reason));
    };
    const result = this.valueOf()({ resolve, reject });
    const promiseResult = isPromise(result);
    if (promiseResult)
      result.then(resolve, reject);
    return this;
  }

  listen(options: ListenOptions<T>) {
    const state = getState<{ listen?: ListenState<T>; result?: MapValue<T>; error?: any }>(this);
    let { listen, result, error } = state;
    const { onRejected, onResolved } = options;

    if (result !== undefined || error !== undefined) {
      onResolved && result && onResolved(result);
      onRejected && error && onRejected(error);
      return this;
    }

    if (!listen) {
      listen = { onResolveds: [], onRejecteds: [] };
    }

    onResolved && listen.onResolveds.push(onResolved);
    onRejected && listen.onRejecteds.push(onRejected);

    setState(this, { value: this.valueOf(), listen });

    return this;
  }
}

export function task<T>(handler: TaskHandler<T>) {
  return new Task(handler);
}
