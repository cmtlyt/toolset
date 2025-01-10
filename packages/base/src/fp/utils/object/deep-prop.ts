import type { TMany, TObject } from '$/types/base';
import { isArray, isNull } from '$/utils';
import { curry, placeholderFunc } from '../function';

/**
 * 根据字符串获取对象属性
 *
 * @sig deepProp_ :: string -> object -> any
 * @param keyPath 属性路径
 * @param obj 对象
 * @param separator 分隔符 (default: '.')
 */
export function deepProp_<R>(keyPath: TMany<string>, obj: TObject<any>, separator: string | RegExp = '.'): R {
  if (!separator && typeof keyPath === 'string')
    return obj[keyPath];

  const keyPaths = isArray(keyPath) ? keyPath : String(keyPath).split(separator);

  return keyPaths.reduce((prev, curr) => isNull(prev) ? prev : prev[curr], obj);
}

const __ = placeholderFunc.__;

interface DeepPropCurry {
  <R>(keyPath: TMany<string>, obj: TObject<any>): R;
  <R>(keyPath: TMany<string>): (obj: TObject<any>) => R;
}

/**
 * 根据点分字符串获取对象属性
 *
 * @sig deepProp :: string -> object -> any
 */
export const deepProp = curry(placeholderFunc(deepProp_)(__, __, '.')) as any as DeepPropCurry;
