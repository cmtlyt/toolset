import { describe, expect, inject, it } from 'vitest';

describe('fp utils', async () => {
  const { utils } = await (() => {
    return inject('CI') ? import('../../dist/fp') : import('../../src/fp');
  })() as typeof import('../../src/fp');

  it('curry functions', () => {
    const arr = [1, 2, 3, 4];
    const isEven = (n: number) => n % 2 === 0;
    const add = (a: number, b: number) => a + b;

    expect(utils.filter(isEven, arr)).toEqual([2, 4]);
    expect(utils.map((n: number) => n * 2, arr)).toEqual([2, 4, 6, 8]);
    expect(utils.reduce(add, 0, arr)).toEqual(10);
    expect(utils.every(isEven, arr)).toEqual(false);
    expect(utils.some(isEven, arr)).toEqual(true);
    expect(utils.find(isEven, arr)).toEqual(2);
    expect(utils.findIndex(isEven, arr)).toEqual(1);
    expect(utils.includes(3, arr)).toEqual(true);
    expect(utils.join('-', arr)).toEqual('1-2-3-4');
  });
});
