import { curry } from '../function/curry';

export function lt_(a: any, b: any): boolean {
  return a < b;
}

interface LtCurry {
  (a: any, b: any): boolean;
  (a: any): (b: any) => boolean;
}

/**
 * 小于
 *
 * @sig lt :: a -> b -> Boolean
 */
export const lt = curry(lt_) as any as LtCurry;
