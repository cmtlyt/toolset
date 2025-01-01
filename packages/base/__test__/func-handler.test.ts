import { describe, expect, it } from 'vitest';
import { compose, pipe } from '../src';

describe('func-handler', () => {
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
