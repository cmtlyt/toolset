import type { TGetType } from '$/types/base';
import { isArray, isString } from '$/utils';
import { curry } from '../function/curry';

export function take_<T>(count: number, arr: T[] | string): T[] | string {
  if (!isArray(arr) && !isString(arr)) {
    throw new TypeError('arr 必须是数组或字符串');
  }

  return arr.slice(0, count);
}

export interface TakeCurry {
  <A extends any[] | string>(count: number, arr: A): TGetType<A>;
  <A extends any[] | string>(count: number): (arr: A) => TGetType<A>;
}

/**
 * 获取数组前 n 个元素
 *
 * @sig take :: Number -> [a] -> [a]
 */
export const take = curry(take_) as any as TakeCurry;
