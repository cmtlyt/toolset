import type { TObject } from '$/types/base';
import { getArray } from '$/utils';
import { curry } from '../function/curry';

export function pick_<O extends TObject<any>, K extends keyof O = keyof O>(keys: K[], obj: O): Pick<O, K> {
  const result = {};
  const keyList = getArray(keys);
  // @ts-expect-error any
  keyList.forEach((key: any) => (result[key] = obj[key]));
  // @ts-expect-error any
  return result;
}

interface PickCurry {
  <O extends TObject<any>, K extends keyof O = keyof O>(keys: K[], obj: O): Pick<O, K>;
  <O extends TObject<any>, K extends keyof O = keyof O>(keys: K[]): (obj: O) => Pick<O, K>;
}

/**
 * 获取部分对象属性
 *
 * @sig pick :: [string] -> object -> object
 */
export const pick = curry(pick_) as any as PickCurry;
