import { curry } from '../function/curry';

interface FilterCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): T[];
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => T[];
}

export function filter_<T>(handle: (item: T, index: number) => boolean, arr: T[]) {
  return arr.filter((item, index) => handle(item, index));
}

/**
 * 数组过滤
 *
 * @sig filter :: ((a, number) -> boolean) -> [a] -> [a]
 */
export const filter = curry(filter_) as any as FilterCurry;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('filter', () => {
    expect(filter(x => x > 2, [1, 2, 3, 4])).toEqual([3, 4]);
  });
}
