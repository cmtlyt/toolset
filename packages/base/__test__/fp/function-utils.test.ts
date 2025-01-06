import { describe, expect, inject, it } from 'vitest';

describe('function utils', async () => {
  const utils = await (async () => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils');
  })() as typeof import('../../src/fp/utils');
  it('applyTo', () => {
    const { applyTo } = utils;
    expect(applyTo(1, (a: number) => a + 1)).toBe(2);
    expect(applyTo(1)((a: number) => a + 1)).toBe(2);
  });
  it('apply', () => {
    const { apply } = utils;
    expect(apply((a: number) => a + 1, [2])).toBe(3);
    expect(apply(Math.max)([1, 2, 3, -99, 42, 6, 7])).toBe(42);
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
  it('placeholderFunc', () => {
    const __ = utils.__;
    expect(utils.placeholderFunc.__).toBe(__);
    const add = (a: number, b: string, c: boolean, d: Record<string, any>) => ({ a, b, c, d });
    const placeAdd = utils.placeholderFunc(add);
    // @ts-expect-error 测试用例
    const func = placeAdd(1, __, true, { a: 1 });
    expect(func).toBeTypeOf('function');
    expect(func('1')).toEqual({ a: 1, b: '1', c: true, d: { a: 1 } });
    // @ts-expect-error 测试用例
    expect(placeAdd(1, '2', true, { a: 1 })()).toEqual({ a: 1, b: '2', c: true, d: { a: 1 } });
    expect(() => func()).toThrow(TypeError);
  });
});
