import { curry } from '../function/curry';

interface MakeByCurry {
  <R>(handle: (index: number) => R, count: number): R[];
  <R>(handle: (index: number) => R): (count: number) => R[];
}

export function makeBy_<R>(handle: (index: number) => R, count: number): R[] {
  return Array.from({ length: count }, (_, index) => handle(index));
}

/**
 * 数组创建
 *
 * @sig makeBy :: ((number -> a) -> number -> [a])
 */
export const makeBy = curry(makeBy_) as any as MakeByCurry;
