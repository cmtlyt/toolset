import { curry } from '../function/curry';

interface FindIndexCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): number;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => number;
}

export function findIndex_<T>(handle: (item: T, index: number) => boolean, arr: T[]): number {
  return arr.findIndex((item, index) => handle(item, index));
}

/**
 * 查找满足条件的元素索引
 *
 * @sig findIndex :: ((a, number) -> boolean) -> [a] -> number
 */
export const findIndex = curry(findIndex_) as any as FindIndexCurry;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('findIndex', () => {
    expect(findIndex(x => x === 2, [1, 2, 3])).toBe(1);
    expect(findIndex(x => x === 4, [1, 2, 3])).toBe(-1);
  });
}
