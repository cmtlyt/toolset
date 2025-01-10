import { describe, expect, inject, it } from 'vitest';

describe('array utils', async () => {
  const utils = await (async () => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils/array');
  })() as typeof import('../../src/fp/utils/array');

  it('groupBy', () => {
    const { groupBy } = utils;
    expect(groupBy(x => x % 2, [1, 2, 3, 4, 5])).toEqual({ 0: [2, 4], 1: [1, 3, 5] });
    expect(groupBy(x => x % 2)([1, 2, 3, 4, 5])).toEqual({ 0: [2, 4], 1: [1, 3, 5] });
    expect(groupBy(x => x % 2)([])).toEqual({ });
  });
  it('groupWith', () => {
    const { groupWith } = utils;
    expect(groupWith((a, b) => a === b, [1, 1, 1, 2, 3, 4, 5])).toEqual([[1, 1, 1], [2], [3], [4], [5]]);
    expect(groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])).toEqual([[0], [1, 1], [2], [3, 5], [8], [13, 21]]);
    expect(groupWith((a, b) => a === b, [])).toEqual([]);
    expect(groupWith((a, b) => /^[aeiou]$/.test(a) === /^[aeiou]$/.test(b))('aestiou')).toEqual(['ae', 'st', 'iou']);
  });
  it('aperture', () => {
    const { aperture } = utils;
    expect(aperture(2, [1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]]);
    expect(aperture(2)([1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]]);
    expect(aperture(2)([])).toEqual([]);
    expect(aperture(2)([1])).toEqual([[1]]);
    expect(aperture(0)([1, 2])).toEqual([[1, 2]]);
    expect(aperture(2.123)([1, 2])).toEqual([[1, 2]]);
    expect(aperture(2.9)([1, 2])).toEqual([[1, 2]]);
    expect(aperture(1.9)([1, 2])).toEqual([[1], [2]]);
  });
  it('append', () => {
    const { append } = utils;
    expect(append(1, [1, 2, 3])).toEqual([1, 2, 3, 1]);
    expect(append(1)([1, 2, 3])).toEqual([1, 2, 3, 1]);
    expect(append(1)([])).toEqual([1]);
    // @ts-expect-error 测试用例
    expect(append([2], [1, 2, 3])).toEqual([1, 2, 3, [2]]);
  });
  it('adjust', () => {
    expect(utils.adjust(1, (item, index) => item + index, [1, 2, 3])).toEqual([1, 3, 3]);
    expect(utils.adjust<number>(5, (item, index) => item + index)([1, 2, 3])).toEqual([1, 2, 3, undefined, undefined, Number.NaN]);
  });
  it('every', () => {
    expect(utils.every(x => x > 0, [1, 2, 3])).toBe(true);
    expect(utils.every(x => x > 0, [1, 2, -3])).toBe(false);
  });
  it('filter', () => {
    expect(utils.filter(x => x > 2, [1, 2, 3, 4])).toEqual([3, 4]);
  });
  it('findIndex', () => {
    expect(utils.findIndex(x => x === 2, [1, 2, 3])).toBe(1);
    expect(utils.findIndex(x => x === 4, [1, 2, 3])).toBe(-1);
  });
  it('find', () => {
    expect(utils.find((item, index) => item === index, [0, 1, 2, 3, 4, 5])).toBe(0);
    expect(utils.find<number>(() => false)([1, 2, 3])).toBe(undefined);
  });
  it('includes', () => {
    expect(utils.includes(1, [1, 2, 3])).toBe(true);
    expect(utils.includes(4, [1, 2, 3])).toBe(false);
    expect(utils.includes(1)([1, 2, 3])).toBe(true);
  });
  it('join', () => {
    expect(utils.join(',', [1, 2, 3])).toBe('1,2,3');
    expect(utils.join('', [1, 2, 3])).toBe('123');
    expect(utils.join('-', [])).toBe('');
    expect(utils.join('-', [1])).toBe('1');
    expect(utils.join(',')([1, 2, 3])).toBe('1,2,3');
  });
  it('makeBy', () => {
    expect(utils.makeBy(i => i, 3)).toEqual([0, 1, 2]);
    expect(utils.makeBy(i => i.toString(), 3)).toEqual(['0', '1', '2']);
  });
  it('map', () => {
    expect(utils.map(item => item * 2, [1, 2, 3])).toEqual([2, 4, 6]);
    expect(utils.map<number>(item => item * 2)([1, 2, 3])).toEqual([2, 4, 6]);
  });
  it('partition', () => {
    expect(utils.partition(x => x > 2, [1, 2, 3, 4, 5])).toEqual({ left: [1, 2], right: [3, 4, 5] });
    expect(utils.partition<number>(x => x > 2)([1, 2, 3, 4, 5])).toEqual({ left: [1, 2], right: [3, 4, 5] });
    expect(utils.partition<number>(x => x > 2)([])).toEqual({ left: [], right: [] });
    expect(utils.partition<number>(x => x > 2)([1])).toEqual({ left: [1], right: [] });
    expect(utils.partition<number>(x => x > 2)([1, 2])).toEqual({ left: [1, 2], right: [] });
    expect(utils.partition<number>(x => x > 2)([1, 2, 3])).toEqual({ left: [1, 2], right: [3] });
  });
  it('reduce', () => {
    expect(utils.reduce((acc, item) => acc + item, 0, [1, 2, 3])).toBe(6);
    expect(utils.reduce<number>((acc, item) => acc + item, 0)([])).toBe(0);
    expect(utils.reduce<number>((acc, item) => acc + item)(0)([1, 2])).toBe(3);
  });
  it('replicate', () => {
    expect(utils.replicate(1, 3)).toEqual([1, 1, 1]);
    expect(utils.replicate(1)(3)).toEqual([1, 1, 1]);
  });
  it('some', () => {
    expect(utils.some(item => item > 2, [1, 2, 3])).toBe(true);
    expect(utils.some(item => item > 2, [1, 2])).toBe(false);
    expect(utils.some<number>(item => item > 2)([1, 2, 3])).toBe(true);
    expect(utils.some<number>(item => item > 2)([1, 2])).toBe(false);
  });
});
