import type { TFunc, TGetReturnType } from '$/types/base';
import { curry } from '../function/curry';

export function groupBy_<T, F extends TFunc<[T], any>>(func: F, arr: T[]): Record<TGetReturnType<F>, T[]> {
  return arr.reduce((acc, item) => {
    const key: TGetReturnType<F> = func(item);
    acc[key] ||= [];
    acc[key].push(item);
    return acc;
  }, {} as Record<TGetReturnType<F>, T[]>);
}

interface GroupByCurry {
  <T, R, F extends TFunc<[T], any> = TFunc<[T], R>>(func: F): (arr: T[]) => Record<TGetReturnType<F>, T[]>;
  <T, F extends TFunc<[T], any>>(func: F, arr: T[]): Record<TGetReturnType<F>, T[]>;
}

/**
 * 分组
 *
 * @sig groupBy :: (a -> b) -> [a] -> {b: [a]}
 */
export const groupBy = curry(groupBy_) as any as GroupByCurry;
