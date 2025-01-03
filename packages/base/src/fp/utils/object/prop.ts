import type { TObject } from '$/types/base';
import { curry } from '../function/curry';

interface PropCurry {
  <O extends TObject<any>, K extends keyof O>(key: K, obj: O): O[K];
  <O extends TObject<any>, K extends keyof O>(key: K): (obj: O) => O[K];
}

export function prop_< O extends TObject<any>, K extends keyof O>(key: K, obj: O) {
  return obj[key];
}

/**
 * 获取对象属性
 *
 * @sig prop :: string -> object -> any
 */
export const prop = curry(prop_) as any as PropCurry;

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest;

  it('正确读取对象属性', () => {
    expect(prop('a', { a: 1 })).toBe(1);
    expect(prop('a', { a: 1, b: 2 })).toBe(1);
    expect(prop('b', { a: 1, b: 2 })).toBe(2);
    // @ts-expect-error 测试用例
    expect(prop('c', { a: 1, b: 2 })).toBe(undefined);
  });
}
