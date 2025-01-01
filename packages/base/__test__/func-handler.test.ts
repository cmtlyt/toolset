import { describe, expect, inject, it } from 'vitest';

describe('func-handler', async () => {
  const { compose, pipe } = await (() => {
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

  it('compose', () => {
    const add = (a: number) => a + 1;
    const double = (a: number) => a * 2;
    const addThenDouble = compose(double, add);
    expect(addThenDouble(1)).toBe(4);

    const filter = (arr: number[]) => arr.filter(v => v % 2);
    const map = (arr: number[]) => arr.map(v => v * 2);
    const filterThenMap = compose(map, filter);
    expect(filterThenMap([1, 2, 3, 4, 5])).toEqual([2, 6, 10]);
  });

  it('pipe', () => {
    const add = (a: number) => a + 1;
    const double = (a: number) => a * 2;
    const addThenDouble = pipe(add, double);
    expect(addThenDouble(1)).toBe(4);

    const filter = (arr: number[]) => arr.filter(v => v % 2);
    const map = (arr: number[]) => arr.map(v => v * 2);
    const filterThenMap = pipe(filter, map);
    expect(filterThenMap([1, 2, 3, 4, 5])).toEqual([2, 6, 10]);
  });
});
