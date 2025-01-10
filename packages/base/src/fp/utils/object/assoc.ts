import type { TMany, TObject } from '$/types/base';
import { curry, placeholderFunc } from '$/fp/utils/function';
import { getArray, getType, isArray, isString } from '$/utils';

export function assoc_(path: TMany<string | number>, value: any, source: TObject<any> | Array<any>, sep: string | RegExp = '.') {
  let _path = path;

  if (!isArray(_path)) {
    if (isString(_path))
      _path = _path.split(sep);
    else _path = getArray(_path);
  }

  const type = getType(source);
  if (type !== 'array' && type !== 'object') {
    throw new TypeError('source must be array or object');
  }

  const result = type === 'array' ? [...source as Array<any>] : { ...source };
  const target = _path.slice(0, -1).reduce((acc, cur) =>
    type === 'array'
      ? acc[cur as any] = []
      : acc[cur as any] ||= {}, result);
  target[_path.pop()! as any] = value;

  return result;
}

interface AssocCurry {
  <R>(path: TMany<string | number>, value: any, source: TObject<any>): R;
  <R>(path: TMany<string | number>, value: any): (source: TObject<any>) => R;
  <R>(path: TMany<string | number>): (value: any) => (source: TObject<any>) => R;
}

const { __ } = placeholderFunc;

/**
 * 设置对象属性 (支持点分递归 key)
 *
 * @sig assoc :: String b -> a -> {k: v} -> {b: a}
 */
export const assoc = curry(placeholderFunc(assoc_)(__, __, __, '.')) as any as AssocCurry;
