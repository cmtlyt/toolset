import type { TAnyFunc, TFunc, TGetArgsWithCount, TGetReturnType } from '$/types/base';
import { isNaN } from '$/utils';
import { curry } from '../function/curry';

export function argNumLimit_<N extends number, F extends TAnyFunc>(
  func: F,
  limit: N,
): TFunc<TGetArgsWithCount<F, N>, TGetReturnType<F>> {
  limit = Number(limit) as N;
  if (isNaN(limit))
    throw new TypeError('limit must be a number');

  const limitFunc = (...args: any[]) => {
    return func(...args.slice(0, limit));
  };
  limitFunc.clength = limit;

  return limitFunc;
}

interface ArgNumLimitCurry {
  <N extends number, F extends TAnyFunc>(func: F, limit: N): TFunc<TGetArgsWithCount<F, N>, TGetReturnType<F>>;
  <N extends number, F extends TAnyFunc>(func: F): (limit: N) => TFunc<TGetArgsWithCount<F, N>, TGetReturnType<F>>;
}

/**
 * 限制函数参数数量
 *
 * @sig argNumLimit :: (a... -> b) -> Number -> (a... -> b)
 */
export const argNumLimit = curry(argNumLimit_) as any as ArgNumLimitCurry;
