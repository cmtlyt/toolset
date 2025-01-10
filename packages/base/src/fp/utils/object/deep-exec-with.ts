import type { TFunc, TObject } from '$/types/base';
import { getType } from '$/utils';
import { curry } from '../function/curry';

export function deepExecWith_(
  func: TFunc<[any, string], any>,
  withFunc: TFunc<[any, string], boolean>,
  specObj: TObject<any>,
): TObject<any> {
  const result: TObject<any> = {};

  for (const key in specObj) {
    const item: any = specObj[key];

    if (getType(item) === 'object') {
      result[key] = deepExecWith_(func, withFunc, item);
    }
    else if (withFunc(item, key)) {
      result[key] = func(item, key);
    }
    else {
      result[key] = item;
    }
  }

  return result;
}

/**
 * 根据条件将对象的值传入函数处理
 *
 * @sig deepExecWith :: (a -> b) -> (a -> Boolean) -> {a} -> {b}
 */
export const deepExecWith = curry(deepExecWith_);
