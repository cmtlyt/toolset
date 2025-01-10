import type { TArrayType } from '$/types/base';
import { getArray } from '$/utils';
import { curry } from '../function';

export function append_(item: string, arr: string): string[];
export function append_<T>(item: T, arr: T[]): T[];
export function append_<T>(item: T | string, arr: T[] | string): (T | string)[] {
  return [...getArray(arr), item];
}

interface AppendCurry {
  <T, A extends any[] | string>(item: T, arr: A): A extends any[] ? TArrayType<[...A, T]>[] : string[];
  <T>(item: T): <A extends any[] | string>(arr: A | string) => A extends any[] ? TArrayType<[...A, T]>[] : string[];
}

/**
 * 向数组中追加元素
 *
 * @sig append :: a -> [a] -> [a]
 */
export const append = curry(append_) as any as AppendCurry;
