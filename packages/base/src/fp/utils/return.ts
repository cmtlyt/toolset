import type { TFunc } from '$/types/base';
import { curry } from './function';

export const always_ = <T>(value: T, _: any) => value;

interface AlwaysCurry {
  <T>(value: T, _: any): T;
  <T>(value: T): TFunc<any, T>;
}

/**
 * 恒等函数
 *
 * @summary always :: a -> any -> a
 */
export const always = curry(always_) as any as AlwaysCurry;

/**
 * 恒等函数
 *
 * @summary id :: a -> a
 */
export const id = <T>(value: T): T => value;
export const id_ = id;

interface DefaultValueCurry {
  <T, A>(value: T, input: A): T | A;
  <T, A>(value: T): TFunc<[A], T | A>;
}

export const defaultValue_ = <T, A>(value: T, input: A): T | A => input || value;

/**
 * 默认值
 *
 * @summary defaultValue :: a -> b -> a | b
 */
export const defaultValue = curry(defaultValue_) as any as DefaultValueCurry;
