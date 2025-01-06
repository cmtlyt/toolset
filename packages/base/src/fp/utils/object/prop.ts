import type { TObject } from '$/types/base';
import { curry } from '../function/curry';

interface PropCurry {
  <O extends TObject<any>, K extends keyof O>(key: K, obj: O): O[K];
  <O extends TObject<any>, K extends keyof O>(key: K): (obj: O) => O[K];
}

export function prop_< O extends TObject<any>, K extends keyof O>(key: K, obj: O) {
  return obj[key];
}

/**
 * 获取对象属性
 *
 * @sig prop :: string -> object -> any
 */
export const prop = curry(prop_) as any as PropCurry;
