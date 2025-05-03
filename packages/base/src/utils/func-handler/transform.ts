import type { ErrorResult, TAnyFunc, TArgsType, TFlatPromise, TFunc, TGetReturnType, TReverseArray } from '$/types/base';
import { getNow, withResolvers } from '../get-data';
import { isPromise } from '../verify';
import { cacheByReturn } from './cache';
import { tryCall, tryOrError, tryOrErrorAsync } from './call';

/**
 * 防抖函数 (返回 Promise)
 * @param func 需要防抖的函数
 * @param time 延迟时间 (ms)
 * @param immediately 是否立即执行
 */
export function debounceAsync<F extends TAnyFunc>(
  func: F,
  time = 1000,
  immediately = false,
): (...args: TArgsType<F>) => TFlatPromise<ReturnType<F>> {
  if (time <= 0)
    return func;
  let timer: NodeJS.Timeout | null = null;
  let resolvers: TGetReturnType<typeof withResolvers> | null = null;
  const resetState = () => {
    timer = null;
    resolvers = null;
  };
  // @ts-expect-error return func
  return cacheByReturn(() => {
    if (immediately) {
      return (...args: any) => {
        resolvers ||= withResolvers();
        if (timer) {
          clearTimeout(timer);
        }
        else {
          tryCall(() => {
            const result = func(...args);
            if (isPromise(result))
              result.then(resolvers!.resolve, resolvers!.reject);
            else
              resolvers!.resolve(result);
          }, resolvers.reject);
        }
        timer = setTimeout(resetState, time);
        return resolvers.promise;
      };
    }
    return (...args: any) => {
      resolvers ||= withResolvers();
      // 由于 tryCall 为延迟调用, 所以需要缓存 resolvers, 否则调用时 resolvers 可能为 null
      const _resolver = resolvers;
      if (timer)
        clearTimeout(timer);
      timer = setTimeout(() => {
        tryCall(() => {
          const result = func(...args);
          if (isPromise(result)) {
            result.then((res) => {
              _resolver.resolve(res);
              resetState();
            }, _resolver.reject);
          }
          else {
            _resolver.resolve(result);
            resetState();
          }
        }, _resolver.reject);
      }, time);
      return resolvers.promise;
    };
  });
}

/**
 * 防抖函数
 * @param func 需要防抖的函数
 * @param time 延迟时间 (ms)
 * @param immediately 是否立即执行
 */
export function debounce<F extends TAnyFunc>(
  func: F,
  time = 1000,
  immediately = false,
): (...args: TArgsType<F>) => void {
  if (time <= 0)
    return func;
  const debounceFunc = debounceAsync(func, time, immediately);
  return (...args: TArgsType<F>) => {
    debounceFunc(...args);
  };
}

/**
 * 节流函数
 * @param func 需要节流的函数
 * @param time 延迟时间 (ms)
 * @param immediately 是否立即执行
 */
export function throttle<F extends TAnyFunc>(func: F, time = 100, immediately = true): (...args: TArgsType<F>) => void {
  if (time <= 0)
    return func;
  let timer: NodeJS.Timeout | null = null;
  // @ts-expect-error return func
  return cacheByReturn(() => {
    if (immediately) {
      return (...args: any) => {
        if (timer)
          return;
        func(...args);
        timer = setTimeout(() => {
          timer = null;
        }, time);
      };
    }
    return (...args: any[]) => {
      if (timer)
        return;
      timer = setTimeout(() => {
        func(...args);
        timer = null;
      }, time);
    };
  });
}

const _runTask = cacheByReturn(
  (): ((task: TAnyFunc, args: any[], resolve: (value: any) => void, reject: (reason?: any) => void) => void) => {
    // @ts-expect-error 兼容低版本
    if (globalThis.requestIdleCallback) {
      return (task, args, resolve, reject) => {
        requestIdleCallback((idle) => {
          if (idle.timeRemaining() > 0) {
            try {
              const result = task(...args);
              resolve(result);
            }
            catch (error) {
              reject(error);
            }
          }
          else {
            _runTask(task, args, resolve, reject);
          }
        });
      };
    }
    // @ts-expect-error 兼容低版本
    if (globalThis.requestAnimationFrame) {
      return (task, args, resolve, reject) => {
        const start = getNow();
        requestAnimationFrame(() => {
          if (getNow() - start < 16.6) {
            try {
              const result = task(...args);
              resolve(result);
            }
            catch (error) {
              reject(error);
            }
          }
          else {
            _runTask(task, args, resolve, reject);
          }
        });
      };
    }
    return (task, args, resolve, reject) => {
      setTimeout(() => {
        try {
          const result = task(...args);
          resolve(result);
        }
        catch (error) {
          reject(error);
        }
      }, 0);
    };
  },
);

/**
 * 分片执行任务
 * @param task 需要执行的函数
 */
export function chunkTask<F extends TAnyFunc>(task: F) {
  return (datas: Parameters<F>[] | number): Promise<ReturnType<F>[]> => {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
      const func = async (args: any[]) => {
        return new Promise(_runTask.bind(null, task, args)).then(res => results.push(res), reject);
      };
      (async () => {
        if (typeof datas === 'number') {
          for (let i = 0; i < datas; ++i) {
            await func([i]);
          }
        }
        else if (Array.isArray(datas)) {
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

/**
 * 反转函数参数, 返回新函数
 * @param callback 需要转换的函数
 */
export function reverseArgs<F extends TAnyFunc>(callback: F) {
  return (...args: TReverseArray<Parameters<F>>): ReturnType<F> => callback(...args.reverse());
}

/**
 * 返回一个支持传参的使用 try catch 包裹的函数
 * @see tryCall
 * @param runner
 * @param catcher
 */
export function tryCallFunc<F extends TAnyFunc>(
  runner: F,
  catcher?: (e: any) => void,
): TFunc<Parameters<F>, ReturnType<F>> {
  return (...args: Parameters<F>) => tryCall(() => runner(...args), catcher);
}

/**
 * 返回一个支持传参的使用 try catch 包裹的函数
 *
 * @see tryOrError
 * @param func
 */
export function tryOrErrorFunc<T extends any[], R>(func: TFunc<T, R>): (...args: T) => ErrorResult<R> {
  return function (this: any, ...args: T) {
    return tryOrError(() => func.call(this, ...args));
  };
}

/**
 * 返回一个支持传参和异步的使用 try catch 包裹的函数
 *
 * @see tryOrErrorAsync
 * @param func
 */
export function tryOrErrorAsyncFunc<T extends any[], R>(func: TFunc<T, R>): (...args: T) => Promise<ErrorResult<R>> {
  return function (this: any, ...args: T) {
    return tryOrErrorAsync(() => func.call(this, ...args));
  };
}
