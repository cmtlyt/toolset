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
});
