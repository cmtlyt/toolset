import { describe, expect, inject, it } from 'vitest';

describe('object utils', async () => {
  const utils = await (() => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils');
  })() as typeof import('../../src/fp/utils');
  it('prop', () => {
    const { prop } = utils;

    expect(prop('a', { a: 1 })).toBe(1);
    expect(prop('a', { a: 1, b: 2 })).toBe(1);
    expect(prop('b', { a: 1, b: 2 })).toBe(2);
    // @ts-expect-error 测试用例
    expect(prop('c', { a: 1, b: 2 })).toBe(undefined);
  });
  it('omit', () => {
    const { omit } = utils;
    expect(omit(['a'], { a: 1, b: 2 })).toEqual({ b: 2 });
    expect(omit(['a', 'b'], { a: 1, b: 2 })).toEqual({});
    // @ts-expect-error 测试用例
    expect(omit(['a', 'c'], { a: 1, b: 2 })).toEqual({ b: 2 });
    expect(omit([])({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });
  it('pick', () => {
    const { pick } = utils;
    expect(pick(['a'], { a: 1, b: 2 })).toEqual({ a: 1 });
    expect(pick(['a', 'b'], { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
    // @ts-expect-error 测试用例
    expect(pick(['a', 'c'], { a: 1, b: 2 })).toEqual({ a: 1 });
    expect(pick([])({ a: 1, b: 2 })).toEqual({});
  });
  it('assoc', () => {
    const { assoc } = utils;
    expect(assoc('a', 1, { b: 2 })).toEqual({ a: 1, b: 2 });
    expect(assoc('a', 1)({ b: 2 })).toEqual({ a: 1, b: 2 });
    expect(assoc('a')(1)({ b: 2 })).toEqual({ a: 1, b: 2 });
    expect(assoc('a.b.c', 1, { b: 2 })).toEqual({ b: 2, a: { b: { c: 1 } } });
    expect(assoc(['a', 'b', 'c'], 1, { b: 2 })).toEqual({ b: 2, a: { b: { c: 1 } } });
    expect(assoc(0, 1, [2, 3])).toEqual([1, 3]);
    expect(assoc([0, 1, 1], 1, [2, 3])).toEqual([[undefined, [undefined, 1]], 3]);
    expect(assoc('0.1.1', 1, [2, 3])).toEqual([[undefined, [undefined, 1]], 3]);
    expect(() => assoc(0, 1, 2)).toThrow(TypeError);
  });
  it('deepProp', () => {
    const { deepProp } = utils;
    expect(deepProp('a.b.c', { a: { b: { c: 1 } } })).toBe(1);
    expect(deepProp(['a', 'b', 'c'], { a: { b: { c: 1 } } })).toBe(1);
    expect(deepProp('0.1.1', [2, 3])).toBe(undefined);
    expect(deepProp([0, 1, 1], [2, 3])).toBe(undefined);
    expect(deepProp(0, 2)).toBe(undefined);
    expect(deepProp('0.1', 0)).toBe(undefined);
    expect(deepProp(0, [2, 3])).toBe(2);
    expect(deepProp('toString', 0)).toBeTypeOf('function');
    expect(deepProp('prototype.toString', Object)).toBeTypeOf('function');
  });
});
