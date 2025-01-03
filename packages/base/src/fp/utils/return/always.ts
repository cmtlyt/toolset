import type { TFunc } from '$/types/base';
import { curry } from '../function';

export const always_ = <T>(value: T, _: any) => value;

interface AlwaysCurry {
  <T>(value: T, _: any): T;
  <T>(value: T): TFunc<any, T>;
}

/**
 * 恒等函数
 *
 * @sig always :: a -> any -> a
 */
export const always = curry(always_) as any as AlwaysCurry;
