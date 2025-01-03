import { curry } from '../function/curry';

export function join_(separator: string, arr: any[]) {
  return arr.join(separator);
}

/**
 * 数组连接
 *
 * @sig join :: string -> [a] -> string
 */
export const join = curry(join_);
