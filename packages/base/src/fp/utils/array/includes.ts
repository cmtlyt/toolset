import { curry } from '../function/curry';

interface IncludesCurry {
  <T>(item: T, arr: T[]): boolean;
  <T>(item: T): (arr: T[]) => boolean;
}

export function includes_<T>(item: T, arr: T[]) {
  return arr.includes(item);
}

/**
 * 检测数组是否有满足条件的元素
 *
 * @sig includes :: a -> [a] -> boolean
 */
export const includes = curry(includes_) as any as IncludesCurry;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('includes', () => {
    expect(includes(1, [1, 2, 3])).toBe(true);
    expect(includes(4, [1, 2, 3])).toBe(false);
    expect(includes(1)([1, 2, 3])).toBe(true);
  });
}
