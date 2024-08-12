import {
  GetArgs,
  GetReturnType,
  ReverseArray,
  TAnyFunc,
  TArgsType,
  TCast,
  TDropHead,
  TFunc,
  THeadType,
  TLastTwoArg,
  TLastType,
  TLength,
} from '../types/base';
import { cacheByReturn } from '../cirDep';

import { getArray } from './dataHandler';
import { getNow } from './getData';

class MemoizeMap {
  #_map = new Map();
  #_weakMap = new WeakMap();

  #_isObject(key: any) {
    return typeof key === 'object' && key !== null;
  }

  set(key: any, value: any) {
    if (this.#_isObject(key)) {
      this.#_weakMap.set(key, value);
    } else {
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

export function memoize<F extends (...args: any[]) => any>(func: F, resolver?: (...args: GetArgs<F>) => any) {
  const memoized = function (...args: GetArgs<F>): GetReturnType<F> {
    const key = resolver ? resolver.apply(this, args) : args[0];
    const cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
  memoized.cache = new MemoizeMap();
  return memoized;
}

type TCurry<P extends any[], R> = <T extends any[]>(
  ...args: TCast<T, Partial<P>>
) => TDropHead<TLength<T>, P> extends [any, ...any[]] ? TCurry<TCast<TDropHead<TLength<T>, P>, any[]>, R> : R;

type TCurryFunc = <P extends any[], R>(fn: (...args: P) => R) => TCurry<P, R>;

type TCurryFuncReturnType<F> = F extends TCurry<any, infer R> ? R : F extends TAnyFunc ? ReturnType<F> : any;

export const curry: TCurryFunc = function (func) {
  // @ts-expect-error 自定义属性, 确保获取到参数列表长度
  const length = func?.clength || func?.length || 0;
  if (!length) {
    throw new TypeError('无法读取函数参数列表的长度，不能使用可选参数和剩余参数！！！');
  }
  const curried = (...args: any) => {
    if (args.length >= length) {
      return func.apply(null, args);
    } else {
      const tempFunc = (...args2: any) => curried.apply(null, args.concat(args2));
      tempFunc.clength = length - args.length;
      return tempFunc;
    }
  };
  curried.clength = length;
  return curried as any;
};

function _generateRunFunc(funcs: TAnyFunc[], callback: (funcs: TAnyFunc[], args: any[]) => any) {
  if (funcs.length === 0) return (arg: any) => arg;
  if (funcs.length === 1) return funcs[0];
  const runFunc = (...args: any[]) => callback(funcs, args);
  return runFunc;
}

type TCompose<T extends TAnyFunc[]> = [...any, TFunc<[TCurryFuncReturnType<TLastType<T>>]>, any];

type TComposeFunc = <F extends TCompose<F>>(
  ...funcs: F
) => (...args: Required<TArgsType<TLastType<F>>>) => TCurryFuncReturnType<THeadType<F>>;

/**
 * todo: 类型存在缺陷，只能判断最后输入的函数是否满足条件，不能判断中间的函数
 */
export const compose: TComposeFunc = function compose(...funcs) {
  const func = _generateRunFunc(funcs, (funcs: TAnyFunc[], args: any) =>
    funcs.reduceRight((data, func) => func.apply(null, getArray(data)), args),
  );
  const firstFunc = funcs[funcs.length - 1];
  // @ts-expect-error 自定义属性
  func.clength = firstFunc?.clength || firstFunc?.length;
  return func;
};

type TPipe<T extends TAnyFunc[]> = [...any, any, TFunc<[TCurryFuncReturnType<TLastTwoArg<T>>]>];

type TPipeFunc = <F extends TPipe<F>>(
  ...funcs: F
) => (...args: Required<TArgsType<THeadType<F>>>) => TCurryFuncReturnType<TLastType<F>>;

/**
 * todo: 类型存在缺陷，只能判断最后输入的函数是否满足条件，不能判断中间的函数
 */
export const pipe: TPipeFunc = function pipe(...funcs) {
  const func = _generateRunFunc(funcs, (funcs, args) =>
    funcs.reduce((data, func) => func.apply(null, getArray(data)), args),
  );
  const firstFunc = funcs[0];
  // @ts-expect-error 自定义属性
  func.clength = firstFunc?.clength || firstFunc?.length;
  return func;
};

export function debounce<F extends TAnyFunc>(
  func: F,
  time = 1000,
  immediately = false,
): (...args: TArgsType<F>) => void {
  if (time <= 0) return func;
  let timer = null;
  return cacheByReturn(() => {
    if (immediately) {
      return (...args: any) => {
        if (timer) clearTimeout(timer);
        else func.apply(null, args);
        timer = setTimeout(() => {
          timer = null;
        }, time);
      };
    }
    return (...args: any) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(null, args);
      }, time);
    };
  });
}

export function throttle<F extends TAnyFunc>(func: F, time = 100, immediately = true): (...args: TArgsType<F>) => void {
  if (time <= 0) return func;
  let timer = null;
  return cacheByReturn(() => {
    if (immediately) {
      return (...args: any) => {
        if (timer) return;
        func.apply(null, args);
        timer = setTimeout(() => {
          timer = null;
        }, time);
      };
    }
    return (...args) => {
      if (timer) return;
      timer = setTimeout(() => {
        func.apply(null, args);
        timer = null;
      }, time);
    };
  });
}

const _runTask = cacheByReturn(
  (): ((task: TAnyFunc, args: any[], resolve: (value: any) => void, reject: (reason?: any) => void) => void) => {
    if (globalThis.requestIdleCallback) {
      return (task, args, resolve, reject) => {
        requestIdleCallback((idle) => {
          if (idle.timeRemaining() > 0) {
            try {
              const result = task.apply(null, args);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          } else {
            _runTask(task, args, resolve, reject);
          }
        });
      };
    }
    if (globalThis.requestAnimationFrame) {
      return (task, args, resolve, reject) => {
        const start = getNow();
        requestAnimationFrame(() => {
          if (getNow() - start < 16.6) {
            try {
              const result = task.apply(null, args);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          } else {
            _runTask(task, args, resolve, reject);
          }
        });
      };
    }
    return (task, args, resolve, reject) => {
      setTimeout(() => {
        try {
          const result = task.apply(null, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 0);
    };
  },
);

export function chunkTask<F extends TAnyFunc>(task: F) {
  return (datas: Parameters<F>[] | number): Promise<ReturnType<F>[]> => {
    const results = [];
    return new Promise((resolve, reject) => {
      const func = async (args: any[]) => {
        return new Promise(_runTask.bind(null, task, args)).then((res) => results.push(res), reject);
      };
      (async () => {
        if (typeof datas === 'number') {
          for (let i = 0; i < datas; ++i) {
            await func([i]);
          }
        } else if (Array.isArray(datas)) {
          for (const key in datas) {
            const data = datas[key];
            await func(data);
          }
        }
        resolve(results);
      })();
    });
  };
}

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const sleepSync = (time: number) => {
  const start = getNow();
  while (getNow() - start < time);
};

export function reverseArgs<F extends TAnyFunc>(callback: F) {
  return (...args: ReverseArray<Parameters<F>>): ReturnType<F> => callback.apply(null, args.reverse());
}

export function tryCallFunc<F extends TAnyFunc>(
  runner: F,
  catcher?: (e: any) => void,
): TFunc<Parameters<F>, ReturnType<F>> {
  return (...args: Parameters<F>) => {
    try {
      return runner.apply(null, args);
    } catch (e) {
      if (catcher) catcher(e);
      throw e;
    }
  };
}

export function tryCall<F extends TAnyFunc>(runner: F, catcher?: (e: any) => void): ReturnType<F> {
  try {
    return runner();
  } catch (e) {
    if (catcher) catcher(e);
    throw e;
  }
}

export function onceFunc<T extends TAnyFunc>(func: T): T {
  let called = false;
  let result: ReturnType<T> = null;
  return function (...args) {
    if (called) return result;
    called = true;
    return (result = func.apply(null, args));
  } as T;
}
