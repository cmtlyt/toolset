import { describe, expect, inject, it } from 'vitest';

describe('promise', async () => {
  const utils = await (() => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils');
  })() as typeof import('../../src/fp/utils');

  it('addThen', async () => {
    const { addThen } = utils;
    expect(await addThen(item => item + 1, Promise.resolve(1))).toBe(2);
    expect(await addThen<number, number>(item => item + 1)(Promise.resolve(1))).toBe(2);
  });
});
