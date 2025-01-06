import type { TObject } from '$/types/base';
import { getArray } from '$/utils';
import { curry } from '../function/curry';

export function omit_<O extends TObject<any>, K extends keyof O = keyof O>(keys: K[], obj: O): Omit<O, K> {
  const result = {};
  const keyList = getArray(keys) as any[];
  Object.keys(obj).forEach((key) => {
    if (!keyList.includes(key))
      // @ts-expect-error any
      result[key] = obj[key];
  });
  // @ts-expect-error any
  return result;
}

interface OmitCurry {
  <O extends TObject<any>, K extends keyof O = keyof O>(keys: K[], obj: O): Omit<O, K>;
  <O extends TObject<any>, K extends keyof O = keyof O>(keys: K[]): (obj: O) => Omit<O, K>;
}

/**
 * 删除对部分属性
 *
 * @sig omit :: [string] -> object -> object
 */
export const omit = curry(omit_) as any as OmitCurry;
