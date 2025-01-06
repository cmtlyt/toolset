import { describe, expect, inject, it } from 'vitest';

describe('function utils', async () => {
  const utils = await (async () => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils');
  })() as typeof import('../../src/fp/utils');

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
