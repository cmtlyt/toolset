import { curry } from '../function';

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
