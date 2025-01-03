import type { TFunc } from '$/types/base';
import { curry } from '../function';
import { reduce_ } from './reduce';

interface Partition {
  <R, L = R>(handle: (item: R | L, index: number) => boolean, arr: (R | L)[]): { left: L[]; right: R[] };
  <R, L = R>(handle: (item: R | L, index: number) => boolean): TFunc<[(R | L)[]], { left: L[]; right: R[] }>;
}

export function partition_<R, L = R>(handle: TFunc<[R | L, number], boolean>, arr: (R | L)[]): { left: L[]; right: R[] } {
  return reduce_((acc, item, index) => {
    acc[handle(item, index) ? 'right' : 'left'].push(item);
    return acc;
  }, { left: [] as any[], right: [] as any[] }, arr);
}

/**
 * 数组分区
 *
 * @sig partition :: ((a, number) -> boolean) -> [a] -> { left: [a], right: [a] }
 */
export const partition = curry(partition_) as any as Partition;
