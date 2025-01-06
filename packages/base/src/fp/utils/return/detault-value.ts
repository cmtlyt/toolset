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

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('defaultValue', () => {
    expect(defaultValue(1, 2)).toBe(2);
    expect(defaultValue(1)(2)).toBe(2);
    expect(defaultValue(1)('123')).toBe('123');
    expect(defaultValue(1)(false)).toBe(false);
    expect(defaultValue(1)(undefined)).toBe(1);
    expect(defaultValue(1)(null)).toBe(1);
    expect(defaultValue(1)(Number.NaN)).toBe(Number.NaN);
  });
}
