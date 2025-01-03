import { curry } from '../function';

export function eq_<T>(target: T, value: T): boolean {
  return target === value;
}

interface EqCurry {
  <T>(target: T, value: T): boolean;
  <T>(target: T): (value: T) => boolean;
}

/**
 * 判断两个值是否相等
 *
 * @sig eq :: any -> any -> boolean
 */
export const eq = curry(eq_) as any as EqCurry;
