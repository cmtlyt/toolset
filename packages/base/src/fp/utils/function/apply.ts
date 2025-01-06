import type { TFunc } from '$/types/base';
import { curry } from './curry';

export function apply_<A extends any[], F extends TFunc<A, any> = TFunc<A, any>>(func: F, args: A) {
  return func(...args);
}

export interface ApplyCurry {
  <A extends any[], F extends TFunc<A, any> = TFunc<A, any>>(func: F, args: A): ReturnType<F>;
  <A extends any[], F extends TFunc<A, any> = TFunc<A, any>>(func: F): (args: A) => ReturnType<F>;
}

/**
 * 应用函数
 *
 * @sig apply :: (a... -> b) -> [a] -> b
 */
export const apply = curry(apply_) as any as ApplyCurry;
