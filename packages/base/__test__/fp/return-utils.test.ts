import { describe, expect, inject, it } from 'vitest';

describe('return utils', async () => {
  const utils = await (() => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils');
  })() as typeof import('../../src/fp/utils');

  it('always', () => {
    const { always } = utils;
    expect(always(1, 2)).toBe(1);
    expect(always(1)(2)).toBe(1);
    expect(always(1)(() => {})).toBe(1);
    expect(always(1)(false)).toBe(1);
  });

  it('defaultValue', () => {
    const { defaultValue } = utils;
    expect(defaultValue(1, 2)).toBe(2);
    expect(defaultValue(1)(2)).toBe(2);
    expect(defaultValue(1)('123')).toBe('123');
    expect(defaultValue(1)(false)).toBe(false);
    expect(defaultValue(1)(undefined)).toBe(1);
    expect(defaultValue(1)(null)).toBe(1);
    expect(defaultValue(1)(Number.NaN)).toBe(Number.NaN);
  });

  it('id', () => {
    const { id } = utils;
    expect(id(1)).toBe(1);
    expect(id(false)).toBe(false);
    expect(id(null)).toBe(null);
  });
});
