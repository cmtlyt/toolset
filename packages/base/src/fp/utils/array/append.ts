import { curry } from '../function';

export function append_<T>(item: T, arr: T[]): T[] {
  return [...arr, item];
}

interface AppendCurry {
  <T>(item: T, arr: T[]): T[];
  <T>(item: T): (arr: T[]) => T[];
}

/**
 * 向数组中追加元素
 *
 * @sig append :: a -> [a] -> [a]
 */
export const append = curry(append_) as any as AppendCurry;
