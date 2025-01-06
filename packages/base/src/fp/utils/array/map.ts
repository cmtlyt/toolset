import { curry } from '../function/curry';

interface MapCurry {
  <T, R = any>(handle: (item: T, index: number) => R, arr: T[]): R[];
  <T, R = any>(handle: (item: T, index: number) => R): (arr: T[]) => R[];
}

export function map_<T, R>(handle: (item: T, index: number) => R, arr: T[]): R[] {
  return arr.map((item, index) => handle(item, index));
}

/**
 * 数组转换
 *
 * @sig map :: ((a, number) -> b) -> [a] -> [b]
 */
export const map = curry(map_) as any as MapCurry;
