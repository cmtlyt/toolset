import { describe, expect, inject, it } from 'vitest';

describe('logic-utils', async () => {
  const utils = await (async () => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils/logic');
  })() as typeof import('../../src/fp/utils/logic');

  it('when', () => {
    const { when } = utils;
    expect(when(x => x > 0, x => x + 1)(1)).toBe(2);
    expect(when(x => x > 0, x => x + 1)(-1)).toBe(-1);
    expect(when(x => x > 0)(x => x + 1)(1)).toBe(2);
    expect(when(x => x > 0, x => x + 1, 1)).toBe(2);
  });
});
