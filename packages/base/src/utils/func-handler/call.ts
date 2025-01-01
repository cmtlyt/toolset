import type { TAnyFunc } from '$/types/base';

export function tryCall<F extends TAnyFunc>(runner: F, catcher?: (e: any) => void): ReturnType<F> {
  try {
    return runner();
  }
  catch (e) {
    if (catcher)
      catcher(e);
    throw e;
  }
}

/**
 * 安全的执行函数, 如果函数内出现报错, 则返回错误对象而不是抛出错误
 */
export function completion<T, A extends any[]>(func: (...args: A) => T, ...args: A): T | Error {
  try {
    return func(...args);
  }
  catch (e: any) {
    return e;
  }
}
