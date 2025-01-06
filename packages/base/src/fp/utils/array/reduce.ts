import { curry } from '../function/curry';

interface ReduceCurry {
  <T, R = any>(handle: (acc: R, item: T, index: number) => R, init: R, arr: T[]): R;
  <T, R = any>(handle: (acc: R, item: T, index: number) => R, init: R): (arr: T[]) => R;
  <T, R = any>(handle: (acc: R, item: T, index: number) => R): (init: R) => (arr: T[]) => R;
}

export function reduce_<T, R = T>(handle: (acc: R, item: T, index: number) => R, init: R, arr: T[]) {
  return arr.reduce((acc, item, index) => handle(acc, item, index), init);
}

/**
 * 数组聚合
 *
 * @sig reduce :: ((a, b, number) -> a) -> a -> [b] -> a
 */
export const reduce = curry(reduce_) as any as ReduceCurry;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('reduce', () => {
    expect(reduce((acc, item) => acc + item, 0, [1, 2, 3])).toBe(6);
    expect(reduce<number>((acc, item) => acc + item, 0)([])).toBe(0);
    expect(reduce<number>((acc, item) => acc + item)(0)([1, 2])).toBe(3);
  });
}
