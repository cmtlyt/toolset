import { curry } from '../function/curry';

interface FindCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): T | undefined;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => T | undefined;
}

export function find_<T>(handle: (item: T, index: number) => boolean, arr: T[]): T | undefined {
  return arr.find((item, index) => handle(item, index));
}

/**
 * 查找满足条件的元素
 *
 * @sig find :: ((a, number) -> boolean) -> [a] -> a
 */
export const find = curry(find_) as any as FindCurry;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('find', () => {
    expect(find((item, index) => item === index, [0, 1, 2, 3, 4, 5])).toBe(0);
    expect(find<number>(() => false)([1, 2, 3])).toBe(undefined);
  });
}
