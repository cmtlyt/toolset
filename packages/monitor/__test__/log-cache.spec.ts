/* eslint-disable */
// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { logCache } from '../src/store';

describe('log cache', () => {
  it('push and pop', () => {
    logCache.push('test');
    expect(logCache.pop()).toBe('test');
    expect(logCache.pop()).toBeUndefined();
    expect(logCache.pop()).toBeUndefined();
    logCache.push({ value: 123 });
    logCache.push(() => 123);
    const obj = logCache.pop();
    expect(obj.value).toBe(123);
    const func = logCache.pop();
    expect(func()).toBe(123);
    expect(logCache.pop()).toBeUndefined();
  });

  it('viewCache and popAll', () => {
    const cacheArr1 = logCache.viewCache();
    expect(cacheArr1).toMatchInlineSnapshot(`[]`);
    logCache.push(1);
    logCache.push({ value: 123 });
    logCache.push('test');
    logCache.push(() => {});
    expect(logCache.viewCache()).toMatchInlineSnapshot(`
      [
        1,
        {
          "value": 123,
        },
        "test",
        [Function],
      ]
    `);
    expect(logCache.popAll()).toMatchInlineSnapshot(`
      [
        1,
        {
          "value": 123,
        },
        "test",
        [Function],
      ]
    `);
    expect(logCache.viewCache()).toMatchInlineSnapshot(`[]`);
  });
});
