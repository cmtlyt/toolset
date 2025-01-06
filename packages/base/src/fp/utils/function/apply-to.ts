import type { TFunc } from '$/types/base';
import { curry } from './curry';

export function applyTo_<V, F extends TFunc<[V], any> = TFunc<[V], any>>(value: V, func: F) {
  return func(value);
}

interface ApplyToCurry {
  <V, F extends TFunc<[V], any> = TFunc<[V], any>>(value: V, func: F): ReturnType<F>;
  <V, F extends TFunc<[V], any> = TFunc<[V], any>>(value: V): (func: F) => ReturnType<F>;
}

/**
 * 应用函数
 *
 * @sig applyTo :: a -> (a -> b) -> b
 */
export const applyTo = curry(applyTo_) as any as ApplyToCurry;
