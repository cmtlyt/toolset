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
