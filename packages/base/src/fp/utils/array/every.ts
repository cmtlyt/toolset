import { curry } from '../function/curry';

interface EveryCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => boolean;
}

export function every_<T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean {
  return arr.every((item, index) => handle(item, index));
}

/**
 * 检测所有数组是否满足条件
 *
 * @sig every :: ((a, number) -> boolean) -> [a] -> boolean
 */
export const every = curry(every_) as any as EveryCurry;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('every', () => {
    expect(every(x => x > 0, [1, 2, 3])).toBe(true);
    expect(every(x => x > 0, [1, 2, -3])).toBe(false);
  });
}
