import type { TObject } from '$/types/base';
import { curry } from '../function';

export function deleteProp_<O extends TObject<any>, K extends keyof O>(key: K, source: O): Omit<O, K> {
  const result = { ...source };
  delete result[key];
  return result;
}

interface DeletePropCurry {
  <O extends TObject<any>, K extends keyof O>(key: K, obj: O): Omit<O, K>;
  <R>(key: string): (obj: TObject<any>) => R;
}

/**
 * 删除对象属性
 *
 * @sig deleteProp :: string -> object -> object
 */
export const deleteProp = curry(deleteProp_) as any as DeletePropCurry;
