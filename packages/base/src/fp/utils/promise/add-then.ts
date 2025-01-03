import type { TFunc } from '$/types/base';
import { curry } from '../function';

interface AddThenCurry {
  <T, R>(fn: TFunc<[T], R>, promise: Promise<T>): Promise<R>;
  <T, R>(fn: TFunc<[T], R>): (promise: Promise<T>) => Promise<R>;
}

export function addThen_<T, R>(fn: TFunc<[T], R>, promise: Promise<T>): Promise<R> {
  return promise.then(fn);
}

/**
 * 添加 then 链
 *
 * 用于组合函数的话应处于末尾
 *
 * @sig addThen :: ((a -> b) -> Promise a -> Promise b)
 */
export const addThen = curry(addThen_) as any as AddThenCurry;
