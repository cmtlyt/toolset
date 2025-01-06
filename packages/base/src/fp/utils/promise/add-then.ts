import type { TFunc } from '$/types/base';
import { curry } from '../function/curry';

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

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('addThen', async () => {
    expect(await addThen(item => item + 1, Promise.resolve(1))).toBe(2);
    expect(await addThen<number, number>(item => item + 1)(Promise.resolve(1))).toBe(2);
  });
}
