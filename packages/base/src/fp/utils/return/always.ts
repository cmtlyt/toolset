import type { TFunc } from '$/types/base';
import { curry } from '../function/curry';

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

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('always', () => {
    expect(always(1, 2)).toBe(1);
    expect(always(1)(2)).toBe(1);
    expect(always(1)(() => {})).toBe(1);
    expect(always(1)(false)).toBe(1);
  });
}
