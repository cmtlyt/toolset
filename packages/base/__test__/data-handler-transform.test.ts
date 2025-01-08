import { describe, expect, inject, it } from 'vitest';

describe('data-handler-transform', async () => {
  const utils = await (() => {
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

  it('parseUrl', () => {
    const { parseUrl } = utils;
    const path = 'https://www.baidu.com/a/b/c?a=1&b=2#c?d=3&e=4';
    expect(parseUrl(path).hash).toBe('#c?d=3&e=4');
    expect(parseUrl(path).search).toBe('?a=1&b=2');
    expect(parseUrl(path, { hashQueryToSearchParams: true }).hash).toBe('#c');
    expect(parseUrl(path, { hashQueryToSearchParams: true }).search).toBe('?a=1&b=2&d=3&e=4');
    expect(parseUrl('https://www.baidu.com/a/b/c?a=1&b=2', { hashQueryToSearchParams: true }).search).toBe('?a=1&b=2');
    expect(parseUrl('https://www.baidu.com/a/b/c#c?a=1&b=2', { hashQueryToSearchParams: true }).search).toBe('?a=1&b=2');
    expect(parseUrl('https://www.baidu.com/a/b/c', { hashQueryToSearchParams: true }).search).toBe('');
    expect(() => parseUrl()).toThrow(TypeError);
  });

  it('parseSearch', () => {
    const { parseSearch } = utils;
    const search = '?a=1&b=2';
    expect(parseSearch(search).get('a')).toBe('1');
    expect(parseSearch(search).get('b')).toBe('2');
  });

  it('parseSearchObject', () => {
    const { parseSearchObject, parseSearch } = utils;
    const search = '?a=1&b=2';
    expect(parseSearchObject(parseSearch(search))).toEqual({ a: '1', b: '2' });
    expect(parseSearchObject(search)).toEqual({ a: '1', b: '2' });
  });
});
