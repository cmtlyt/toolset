import { curry } from '../function';

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
