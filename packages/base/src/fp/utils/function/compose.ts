import type { TAnyFunc, TArgsType, TFunc, THeadType, TLastType } from '$/types/base';
import type { TCurryFuncReturnType } from './curry';
import { getArray } from '$/utils';
import { _generateRunFunc } from './_generate-run-func';

type TCompose<T extends TAnyFunc[]> = [...any, TFunc<[TCurryFuncReturnType<TLastType<T>>]>, any];

type TComposeFunc = <F extends TCompose<F>>(
  ...funcs: F
) => (...args: Required<TArgsType<TLastType<F>>>) => TCurryFuncReturnType<THeadType<F>>;

/**
 * 函数组合
 *
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
