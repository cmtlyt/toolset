import { isArray } from '$/utils';
import { curry } from '../function/curry';

export function nth_<T extends any[] | string, I extends number = number>(idx: I, arr: T): T[I] | undefined {
  if (!isArray(arr) && typeof arr !== 'string') {
    throw new TypeError('arr 必须是数组');
  }
  if (idx < 0) {
    idx = arr.length + idx as any;
  }
  if (idx < 0 || idx >= arr.length) {
    return undefined;
  }

  return arr[idx] as any;
}

interface NthCurry {
  <T extends any[] | string, I extends number = number>(idx: I): (arr: T) => T[I] | undefined;
  <T extends any[] | string, I extends number = number>(idx: I, arr: T): T[I] | undefined;
}

/**
 * 获取数组或字符串的指定元素
 *
 * @sig nth :: Number -> ([a] | String) -> (a | String | undefined)
 */
export const nth = curry(nth_) as any as NthCurry;
