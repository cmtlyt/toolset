import { describe, expect, inject, it } from 'vitest';

describe('function utils', async () => {
  const utils = await (async () => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils');
  })() as typeof import('../../src/fp/utils');

  it('argNumLimit', () => {
    const { argNumLimit } = utils;
    expect(argNumLimit(Math.max, 2)(1, 2, 3, -99, 42, 6, 7)).toBe(2);
    expect(argNumLimit(Math.max, 3)(1, 2, 3, -99, 42, 6, 7)).toBe(3);
    expect(argNumLimit((a: number, b: string, c: boolean) => `${a}${b}${c}`, 2)(2, 3, -99, 42, 6, 7)).toBe('23undefined');
    // @ts-expect-error 测试用例
    expect(argNumLimit(Math.max, '')(1, 2, 3)).toBe(-Infinity);
    // @ts-expect-error 测试用例
    expect(argNumLimit(Math.max, '2')(1, 2, 3)).toBe(2);
    // @ts-expect-error 测试用例
    expect(() => argNumLimit(Math.max, '2a')(1, 2, 3)).toThrow(TypeError);
  });
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
