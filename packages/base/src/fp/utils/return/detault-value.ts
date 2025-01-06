import type { TFunc } from '$/types/base';
import { curry } from '../function/curry';

interface DefaultValueCurry {
  <T, A>(value: T, input: A): T | A;
  <T, A>(value: T): TFunc<[A], T | A>;
}

export const defaultValue_ = <T, A>(value: T, input: A): T | A => input ?? value;

/**
 * 默认值
 *
 * @sig defaultValue :: a -> b -> a | b
 */
export const defaultValue = curry(defaultValue_) as any as DefaultValueCurry;
