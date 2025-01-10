import { curry } from '../function/curry';

export function gt_(a: any, b: any): boolean {
  return a > b;
}

interface GtCurry {
  (a: any, b: any): boolean;
  (a: any): (b: any) => boolean;
}

/**
 * 大于
 *
 * @sig gt :: a -> b -> Boolean
 */
export const gt = curry(gt_) as any as GtCurry;
