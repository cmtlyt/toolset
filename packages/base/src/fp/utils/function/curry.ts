import type { TAnyFunc, TCast, TDropHead, TLength } from '$/types/base';

type TCurry<P extends any[], R> = <T extends any[]>(
  ...args: TCast<T, Partial<P>>
) => TDropHead<TLength<T>, P> extends [any, ...any[]] ? TCurry<TCast<TDropHead<TLength<T>, P>, any[]>, R> : R;

type TCurryFunc = <P extends any[], R>(fn: (...args: P) => R) => TCurry<P, R>;

export type TCurryFuncReturnType<F> = F extends TCurry<any, infer R> ? R : F extends TAnyFunc ? ReturnType<F> : F;

/**
 * 函数柯里化
 */
export const curry: TCurryFunc = function (func) {
  // @ts-expect-error 自定义属性, 确保获取到参数列表长度
  const length = func?.clength || func?.length || 0;
  if (!length) {
    throw new TypeError('无法读取函数参数列表的长度，不能使用可选参数和剩余参数！！！');
  }
  const curried = (...args: any) => {
    if (args.length >= length) {
      return func(...args);
    }
    else {
      const tempFunc = (...args2: any) => curried(...args.concat(args2));
      tempFunc.clength = length - args.length;
      return tempFunc;
    }
  };
  curried.clength = length;
  return curried as any;
};
