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
  it('lt', () => {
    const { lt } = utils;
    expect(lt(1, 2)).toBe(true);
    expect(lt(2, 1)).toBe(false);
    expect(lt(1)(2)).toBe(true);
    expect(lt(2)(1)).toBe(false);
    expect(lt('2')('1')).toBe(false);
    expect(lt('1')('2')).toBe(true);
  });
  it('gt', () => {
    const { gt } = utils;
    expect(gt(1, 2)).toBe(false);
    expect(gt(2, 1)).toBe(true);
    expect(gt(1)(2)).toBe(false);
    expect(gt(2)(1)).toBe(true);
    expect(gt('2')('1')).toBe(true);
    expect(gt('1')('2')).toBe(false);
  });
  it('both', () => {
    const { both, gt, lt } = utils;
    expect(both(gt(3), lt(1))(2)).toBe(true);
    expect(both(gt(3), lt(1))('2')).toBe(true);
    expect(both(gt(1), lt(3))(4)).toBe(false);
    expect(both(gt(1), lt(3))(1)).toBe(false);
    expect(both(gt('3'), lt(1))(2)).toBe(true);
    expect(both(gt('1'), lt('3'))('4')).toBe(false);
    expect(both(gt('1'), lt('3'))('2')).toBe(false);
  });
});
