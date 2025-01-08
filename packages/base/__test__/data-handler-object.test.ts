import { describe, expect, inject, it } from 'vitest';

describe('data-handler-transform', async () => {
  const utils = await (() => {
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

  it('fromEntries', () => {
    const { fromEntries } = utils;
    expect(fromEntries([['a', 1], ['b', 2]])).toEqual({ a: 1, b: 2 });
  });
});
