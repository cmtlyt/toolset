import { describe, expect, inject, it } from 'vitest';

describe('compare utils', async () => {
  const utils = await (() => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils/compare');
  })() as typeof import('../../src/fp/utils/compare');

  it('eq', () => {
    expect(utils.eq(1, 1)).toBe(true);
    expect(utils.eq(1)(1)).toBe(true);
    expect(utils.eq(1)(2)).toBe(false);
  });
});
