import type { TArrayItem, TFunc, TGetType } from '$/types/base';
import { curry } from '../function/curry';

export function groupWith_<
  A extends any[] | string,
  F extends TFunc<[TGetType<TArrayItem<A>>, TGetType<TArrayItem<A>>], boolean>,
>(func: F, arr: A): A extends string ? string[] : A[] {
  const len = arr.length;
  let idx = 0;
  const result: A[] = [];
  // 循环整个数组
  while (idx < len) {
    let nextIdx = idx + 1;
    while (nextIdx < len && func(arr[nextIdx], arr[nextIdx - 1]))
      ++nextIdx;
    result.push(arr.slice(idx, nextIdx) as A);
    idx = nextIdx;
  }
  return result as any;
}

interface GroupWithCurry {
  <
    A extends any[] | string,
    F extends TFunc<[TGetType<TArrayItem<A>>, TGetType<TArrayItem<A>>], boolean> = TFunc<[TGetType<TArrayItem<A>>, TGetType<TArrayItem<A>>], boolean>,
  >(func: F): (arr: A) => A extends string ? string[] : A[];
  <
    A extends any[] | string,
    F extends TFunc<[TGetType<TArrayItem<A>>, TGetType<TArrayItem<A>>], boolean>,
  >(func: F, arr: A): A extends string ? string[] : A[];
}

/**
 * 分组
 *
 * @sig groupWith :: (a -> a -> Boolean) -> [a] -> [[a]]
 */
export const groupWith = curry(groupWith_) as any as GroupWithCurry;
