import { describe, expect, it } from 'vitest';
import { setStore, getStore, removeStore, clearStore } from '../src/store';

describe('store', () => {
  it('setStore and getStore', () => {
    setStore('test', 'test');
    expect(getStore('test')).toBe('test');
    expect(getStore()).toMatchInlineSnapshot(`
      {
        "test": "test",
      }
    `);
    expect(getStore('test1')).toBeUndefined();
    setStore('test', () => console.log(1));
    expect(getStore('test')).toBeTypeOf('function');
    expect(getStore('test').toString()).toBe('() => console.log(1)');
    setStore('test1', 1);
    setStore('test2', true);
    setStore('test3', {});
    expect(getStore()).toMatchInlineSnapshot(`
      {
        "test": [Function],
        "test1": 1,
        "test2": true,
        "test3": {},
      }
    `);
  });

  it('removeStore', () => {
    removeStore('test');
    expect(getStore()).toMatchInlineSnapshot(`
      {
        "test1": 1,
        "test2": true,
        "test3": {},
      }
    `);
  });

  it('clearStore', () => {
    clearStore();
    expect(getStore()).toMatchInlineSnapshot(`{}`);
  });
});
