import type { ReverseArray, TAnyFunc, TArgsType, TFunc } from '$/types/base';
import { getNow } from '../get-data';
import { cacheByReturn } from './cache';

export function debounce<F extends TAnyFunc>(
  func: F,
  time = 1000,
  immediately = false,
): (...args: TArgsType<F>) => void {
  if (time <= 0)
    return func;
  let timer: NodeJS.Timeout | null = null;
  // @ts-expect-error return func
  return cacheByReturn(() => {
    if (immediately) {
      return (...args: any) => {
        if (timer)
          clearTimeout(timer);
        else func(...args);
        timer = setTimeout(() => {
          timer = null;
        }, time);
      };
    }
    return (...args: any) => {
      if (timer)
        clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, time);
    };
  });
}

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

export function reverseArgs<F extends TAnyFunc>(callback: F) {
  return (...args: ReverseArray<Parameters<F>>): ReturnType<F> => callback(...args.reverse());
}

export function tryCallFunc<F extends TAnyFunc>(
  runner: F,
  catcher?: (e: any) => void,
): TFunc<Parameters<F>, ReturnType<F>> {
  return (...args: Parameters<F>) => {
    try {
      return runner(...args);
    }
    catch (e) {
      if (catcher)
        catcher(e);
      throw e;
    }
  };
}
