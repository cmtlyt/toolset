import type { TAnyFunc } from '$/types/base';

/**
 * try catch 的封装, 如果函数内报错, 则会被 catcher 捕获, 如果为传递, 则会直接抛出错误
 */
export function tryCall<F extends TAnyFunc>(runner: F, catcher?: (e: any) => void): ReturnType<F> | void {
  try {
    return runner();
  }
  catch (e) {
    if (catcher) {
      catcher(e);
      return;
    }
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
