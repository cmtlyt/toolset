import type { TAnyFunc, TArgsType, TFunc, THeadType, TLastTwoArg, TLastType } from '$/types/base';
import type { TCurryFuncReturnType } from './curry';
import { getArray } from '$/utils';
import { _generateRunFunc } from './_generate-run-func';

type TPipe<T extends TAnyFunc[]> = [...any, any, TFunc<[TCurryFuncReturnType<TLastTwoArg<T>>]>];

type TPipeFunc = <F extends TPipe<F>>(
  ...funcs: F
) => (...args: Required<TArgsType<THeadType<F>>>) => TCurryFuncReturnType<TLastType<F>>;

/**
 * 函数管道
 *
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
