import { curry } from '../function';

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
