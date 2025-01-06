import type { TFunc } from '$/types/base';
import { curry } from '../function/curry';

export function join_(separator: string, arr: any[]) {
  return arr.join(separator);
}

interface JoinCurry {
  (separator: string): TFunc<[any[]], string>;
  (separator: string, arr: any[]): string;
}

/**
 * 数组连接
 *
 * @sig join :: string -> [a] -> string
 */
export const join = curry(join_) as any as JoinCurry;
