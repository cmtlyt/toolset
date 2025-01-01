import type { TAnyFunc, TArgsType, TCast, TDropHead, TFunc, THeadType, TLastTwoArg, TLastType, TLength } from '$/types/base';
import { getArray } from '$/utils';

export type TCurry<P extends any[], R> = <T extends any[]>(
  ...args: TCast<T, Partial<P>>
) => TDropHead<TLength<T>, P> extends [any, ...any[]] ? TCurry<TCast<TDropHead<TLength<T>, P>, any[]>, R> : R;

type TCurryFunc = <P extends any[], R>(fn: (...args: P) => R) => TCurry<P, R>;

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

type TCurryFuncReturnType<F> = F extends TCurry<any, infer R> ? R : F extends TAnyFunc ? ReturnType<F> : any;

function _generateRunFunc(funcs: TAnyFunc[], callback: (funcs: TAnyFunc[], ...args: any[]) => any) {
  if (funcs.length === 0)
    return (arg: any) => arg;
  if (funcs.length === 1)
    return funcs[0];
  const runFunc = (...args: any[]) => callback(funcs, ...args)[0];
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
  const func = _generateRunFunc(funcs, (funcs, ...args) =>
    funcs.reduceRight((data, func) => [func(...getArray(data))], args));
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
  const func = _generateRunFunc(funcs, (funcs, ...args) =>
    funcs.reduce((data, func) => [func(...getArray(data))], args));
  const firstFunc = funcs[0];
  // @ts-expect-error 自定义属性
  func.clength = firstFunc?.clength || firstFunc?.length;
  return func;
};
