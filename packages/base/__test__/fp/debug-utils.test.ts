import { describe, expect, inject, it } from 'vitest';

describe('debug utils', async () => {
  const utils = await (() => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils');
  })() as typeof import('../../src/fp/utils');

  it('trace', () => {
    const { trace } = utils;
    expect(trace(v => expect(v).toBe(1))(1)).toBe(1);
    expect(trace(v => v)(1)).toBe(1);
    expect(trace((v) => {
      throw new Error(`${v}`);
    })(1)).toBe(1);
  });
});
