import type { TObject, TOptional } from '$/types/base';
import { curry } from '../function';
import { deleteProp_ } from './delete-prop';
import { prop_ } from './prop';

export function rename_<O extends TObject<any>>(nameMap: Record<keyof O, string>, source: O): TOptional<O> & TObject<any> {
  const result = { ...source };
  for (const key in nameMap) {
    const value = prop_(key, source);
    deleteProp_(key, source);
    result[nameMap[key]] = value;
  }
  return result;
}

interface RenameCurry {
  <O extends TObject<any>>(nameMap: Record<keyof O, string>, source: O): TOptional<O> & TObject<any>;
  (nameMap: Record<string, string>): (source: TObject<any>) => TObject<any>;
}

/**
 * 重命名对象属性
 *
 * @sig rename :: {k: string} -> object -> object
 */
export const rename = curry(rename_) as any as RenameCurry;
