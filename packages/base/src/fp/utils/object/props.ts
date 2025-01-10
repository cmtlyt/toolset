import type { TMany, TObject } from '$/types/base';
import { reduce } from '../array/reduce';
import { placeholderFunc } from '../function';
import { curry } from '../function/curry';
import { assoc_ } from './assoc';
import { deepProp_ } from './deep-prop';

export function props_(keys: TMany<string>[], source: TObject<any>, sep: string | RegExp = '.') {
  return reduce((acc, key) => assoc_(key, deepProp_(key, source, sep), acc, sep), {} as TObject<any>, keys);
}

interface PropsCurry {
  <R extends TObject<any>>(keys: TMany<string>[], source: TObject<any>): R;
  <R extends TObject<any>>(keys: TMany<string>[]): (source: TObject<any>) => R;
}

const { __ } = placeholderFunc;

/**
 * 获取对象指定 key 的值
 *
 * @sig props :: [String] -> Object -> Object
 */
export const props = curry(placeholderFunc(props_)(__, __, '.')) as any as PropsCurry;
