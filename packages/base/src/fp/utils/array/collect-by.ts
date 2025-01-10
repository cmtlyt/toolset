import type { TFunc } from '$/types/base';
import { isArray } from '$/utils';
import { curry } from '../function/curry';

export function collectBy_<T, F extends TFunc<[T, number], any>>(withFunc: F, arr: T[]): T[][] {
  if (!isArray(arr))
    throw new TypeError('arr 必须是数组');
  if (!arr.length)
    return [];

  const keyMap: any[] = [];

  return arr.reduce((acc, item, index) => {
    const key = withFunc(item, index);
    const cacheIdx = keyMap.indexOf(key);
    const idx = ~cacheIdx ? cacheIdx : keyMap.push(key) - 1;
    (acc[idx] ||= []).push(item);
    return acc;
  }, [] as T[][]);
}

interface CollectByCurry {
  <T, F extends TFunc<[T, number], any> = TFunc<[T, number], any>>(withFunc: F): (arr: T[]) => T[][];
  <T, F extends TFunc<[T, number], any>>(withFunc: F, arr: T[]): T[][];
}

export const collectBy = curry(collectBy_) as any as CollectByCurry;
