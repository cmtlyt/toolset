import { describe, expect, inject, it } from 'vitest';

describe('object utils', async () => {
  const utils = await (() => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils');
  })() as typeof import('../../src/fp/utils');

  it('rename', () => {
    const { rename } = utils;
    expect(rename({ a: 'b' }, { a: 1 })).toEqual({ b: 1 });
    expect(rename({ a: 'b' })({ a: 1 })).toEqual({ b: 1 });
    expect(rename({ a: 'b' })({ a: 1, b: 2 })).toEqual({ b: 1 });
    expect(rename({ a: 'b' })({ a: 1, c: 2 })).toEqual({ b: 1, c: 2 });
    expect(rename({ a: 'b' })({ c: 1 })).toEqual({ c: 1, b: undefined });
  });
  it('deleteProp', () => {
    const { deleteProp } = utils;
    expect(deleteProp('a', { a: 1 })).toEqual({});
    expect(deleteProp('a', { a: 1, b: 2 })).toEqual({ b: 2 });
    expect(deleteProp('c')({ a: 1, b: 2 })).toEqual({ b: 2, a: 1 });
  });
  it('props', () => {
    const { props } = utils;
    expect(props(['a', 'b'], { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
    expect(props(['a', 'b', 'c'], { a: 1, b: 2 })).toEqual({ a: 1, b: 2, c: undefined });
    expect(props(['a.b.c', 'd'])({ a: { b: { c: 1, e: 3 } }, d: 2 })).toEqual({ a: { b: { c: 1 } }, d: 2 });
    const b = { c: 1, e: 3 };
    const result = props(['a.b', 'd'])({ a: { b }, d: 2 });
    expect(result).toEqual({ a: { b }, d: 2 });
    expect(result.a.b).toBe(b);
  });
  it('deepExecWith', () => {
    const { deepExecWith } = utils;
    expect(deepExecWith((x: number) => x + 1, (x: number) => x % 2 === 0, { a: 1, b: 2 })).toEqual({ a: 1, b: 3 });
    expect(deepExecWith((x: number) => x + 1, (x: number) => x % 2 === 0, [1, 2])).toEqual({ 0: 1, 1: 3 });
    expect(deepExecWith((v, k) => `${k}${String(v)}`, Boolean)({ a: 1, b: { c: { d: 2, f: { g: [4] } }, e: 3 } })).toEqual({
      a: 'a1',
      b: { c: { d: 'd2', f: { g: 'g4' } }, e: 'e3' },
    });
    expect(deepExecWith((v, k) => `${k}${String(v)}`, v => typeof v === 'number')({ a: 1, b: { c: { d: 2, f: { g: [4] } }, e: 3 } })).toEqual({
      a: 'a1',
      b: { c: { d: 'd2', f: { g: [4] } }, e: 'e3' },
    });
  });
  it('deepExec', () => {
    const { deepExec } = utils;
    expect(deepExec((x: number) => x + 1, { a: 1, b: 2 })).toEqual({ a: 2, b: 3 });
    expect(deepExec((x: number) => x + 1, [1, 2])).toEqual({ 0: 2, 1: 3 });
    expect(deepExec((v, k) => `${k}${String(v)}`)({ a: 1, b: { c: { d: 2, f: { g: [4] } }, e: 3 } })).toEqual({
      a: 'a1',
      b: { c: { d: 'd2', f: { g: 'g4' } }, e: 'e3' },
    });
  });
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
    const { deepProp, deepProp_ } = utils;
    expect(deepProp_('a.b.c', { a: { b: { c: 1 } } }, '')).toBe(undefined);
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
  it('applySpec', () => {
    const { applySpec } = utils;
    expect(applySpec({ a: (x: number) => x + 1, b: (x: number) => x * 2 })([1])).toEqual({ a: 2, b: 2 });
    expect(applySpec({
      sum: (x: number, y: number) => x + y,
      nested: {
        mut: (x: number, y: number) => x * y,
      },
    }, [1, 2])).toEqual({ sum: 3, nested: { mut: 2 } });
    expect(applySpec({}, [])).toEqual({});
    // @ts-expect-error 测试用例
    expect(() => applySpec(123, [])).toThrow(TypeError);
    expect(applySpec([(a: number) => a + 1, (b: number) => b * 2], [2])).toEqual({ 0: 3, 1: 4 });
  });
});
