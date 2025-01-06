import { curry } from '../function/curry';

interface SomeCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => boolean;
}

export function some_<T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean {
  return arr.some((item, index) => handle(item, index));
}

/**
 * 检测数组是否有满足条件的元素
 *
 * @sig some :: ((a, number) -> boolean) -> [a] -> boolean
 */
export const some = curry(some_) as any as SomeCurry;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('some', () => {
    expect(some(item => item > 2, [1, 2, 3])).toBe(true);
    expect(some(item => item > 2, [1, 2])).toBe(false);
    expect(some<number>(item => item > 2)([1, 2, 3])).toBe(true);
    expect(some<number>(item => item > 2)([1, 2])).toBe(false);
  });
}
