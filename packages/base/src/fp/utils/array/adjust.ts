import { curry } from '../function/curry';

interface AdjustCurry {
  <T>(index: number, handle: (item: T, index: number) => T, arr: T[]): T[];
  <T>(index: number, handle: (item: T, index: number) => T): (arr: T[]) => T[];
  (index: number): <T>(handle: (item: T, index: number) => T, arr: T[]) => T[];
  <T>(index: number): (handle: (item: T, index: number) => T) => (arr: T[]) => T[];
}

export function adjust_<T>(index: number, handle: (item: T, index: number) => T, arr: T[]) {
  const result = [...arr];
  result[index] = handle(result[index], index);
  return result;
}

/**
 * 修改数组指定位置的元素
 *
 * @sig adjust :: number -> ((a, number) -> a) -> [a] -> [a]
 */
export const adjust = curry(adjust_) as any as AdjustCurry;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('adjust', () => {
    expect(adjust(1, (item, index) => item + index, [1, 2, 3])).toEqual([1, 3, 3]);
    expect(adjust<number>(5, (item, index) => item + index)([1, 2, 3])).toEqual([1, 2, 3, undefined, undefined, Number.NaN]);
  });
}
