import { curry } from '../function';

export function zip_<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

interface ZipCurry {
  <A, B>(a: A, b: B): [A, B];
  (a: any): (b: any) => [any, any];
}

/**
 * 将两个元素打包成元组
 *
 * @sig zip :: a -> b -> (a, b)
 */
export const zip = curry(zip_) as any as ZipCurry;
