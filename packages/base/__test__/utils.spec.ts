// @vitest-environment happy-dom

import { it, describe, expectTypeOf, expect } from 'vitest';
import {
  generateClassName,
  generateCookieInfo,
  getArray,
  gc,
  getType,
  getNow,
  getDeviceInfo,
  safeGetGlobal,
  getRandomString,
  createLinkByString,
  isUndef,
  isNaN,
  isNumber,
  isString,
  isPromise,
  isEmpty,
  isFile,
  isBlob,
  isUrl,
  isTrue,
  isFalse,
  isAsyncFunc,
  getAliAppEnv,
  memoize,
  curry,
  sleep,
  reverseArgs,
  throttle,
  debounce,
  compose,
  pipe,
  chunkTask,
  sleepSync,
} from '../src/utils';
import { EMPTY } from '../src';

describe('utils', () => {
  describe('getData', () => {
    it('getArray', ({ expect }) => {
      expect(getArray([])).toStrictEqual([]);
      expect(getArray([1, 2, 3])).toStrictEqual([1, 2, 3]);
      expect(getArray(1)).toEqual([1]);
    });

    it('generateCookieInfo', ({ expect }) => {
      expect(generateCookieInfo()).toMatchInlineSnapshot(`""`);
      expect(generateCookieInfo({})).toMatchInlineSnapshot(`""`);
      expect(generateCookieInfo({ data: { name: 'test', value: '123' } })).toMatchInlineSnapshot(`"test=123;"`);
      expect(
        generateCookieInfo({
          domain: '.taobao.com',
          path: '/',
          expires: '1d',
        }),
      )
        .includes('expires=')
        .includes('domain=.taobao.com;path=/;');
      expect(
        generateCookieInfo({
          domain: '.taobao.com',
          path: '/',
          expires: new Date('2024-01-01'),
        }),
      ).toMatchInlineSnapshot(`"expires=Mon, 01 Jan 2024 00:00:00 GMT;domain=.taobao.com;path=/;"`);
      expect(
        generateCookieInfo({
          domain: '.taobao.com',
          path: '/',
          duration: 1000,
        }),
      )
        .includes('expires=')
        .includes('domain=.taobao.com;path=/;');
      expect(
        generateCookieInfo({
          data: { name: 'test', value: '123' },
          domain: '.taobao.com',
          path: '/',
          maxAge: 1000,
        }),
      ).toMatchInlineSnapshot(`"test=123;domain=.taobao.com;max-age=1000;path=/;"`);
      expect(() =>
        generateCookieInfo({
          data: { name: 'test', value: '123' },
          domain: '.taobao.com',
          path: '/',
          // @ts-expect-error test
          expires: true,
        }),
      ).toThrowErrorMatchingInlineSnapshot(`[TypeError: expires 必须是字符串或 Date (推荐使用Date)]`);
    });

    it('getType', ({ expect }) => {
      expect(getType('')).toBe('string');
      expect(getType(1)).toBe('number');
      expect(getType(true)).toBe('boolean');
      expect(getType([])).toBe('array');
      expect(getType({})).toBe('object');
      expect(getType(null)).toBe('null');
      expect(getType(undefined)).toBe('undefined');
      expect(getType(Symbol('test'))).toBe('symbol');
      expect(getType(new Date())).toBe('date');
      expect(getType(new Error())).toBe('error');
      expect(getType(new Map())).toBe('map');
      expect(getType(new WeakMap())).toBe('weakmap');
      expect(getType(new Set())).toBe('set');
      expect(getType(new WeakSet())).toBe('weakset');
      expect(getType(function () {})).toBe('function');
      expect(getType(async function () {})).toBe('asyncfunction');
      expect(getType(Promise.resolve())).toBe('promise');
      expect(getType(new Int8Array())).toBe('int8array');
      expect(getType(new Uint8Array())).toBe('uint8array');
      expect(getType(new Uint8ClampedArray())).toBe('uint8clampedarray');
      expect(getType(new Int16Array())).toBe('int16array');
      expect(getType(new Uint16Array())).toBe('uint16array');
      expect(getType(new Int32Array())).toBe('int32array');
      expect(getType(new Uint32Array())).toBe('uint32array');
      expect(getType(new Float32Array())).toBe('float32array');
      expect(getType(new Float64Array())).toBe('float64array');
      expect(getType(new BigInt64Array())).toBe('bigint64array');
      expect(getType(new BigUint64Array())).toBe('biguint64array');
    });

    it('gc', ({ expect }) => {
      expect(generateClassName('test')).toMatchInlineSnapshot(`"test"`);
      expect(gc('test')).toMatchInlineSnapshot(`"test"`);
      expect(gc()).toMatchInlineSnapshot(`""`);
      expect(gc('test', 'test2')).toMatchInlineSnapshot(`"test test2"`);
      expect(gc('test', ['test2'])).toMatchInlineSnapshot(`"test test2"`);
      expect(gc('test', { test2: true })).toMatchInlineSnapshot(`"test test2"`);
      expect(gc('test', { test2: false })).toMatchInlineSnapshot(`"test"`);
      expect(gc('test', { test2: true }, 'test3')).toMatchInlineSnapshot(`"test test2 test3"`);
      expect(gc('test', { test2: false }, 'test3')).toMatchInlineSnapshot(`"test test3"`);
      expect(gc('test', { test2: true }, ['test3'])).toMatchInlineSnapshot(`"test test2 test3"`);
      expect(gc('test', { test2: false }, ['test3'])).toMatchInlineSnapshot(`"test test3"`);
      expect(gc('test', { test2: true }, { test3: true })).toMatchInlineSnapshot(`"test test2 test3"`);
      expect(gc('test', { test2: false }, { test3: true })).toMatchInlineSnapshot(`"test test3"`);
      expect(gc(['test', { test2: true }, null])).toMatchInlineSnapshot(`"test test2"`);
      expect(gc(['test', { test2: true }, undefined])).toMatchInlineSnapshot(`"test test2"`);
    });

    it('getNow', () => {
      expectTypeOf(getNow()).toEqualTypeOf<number>();
      const now = getNow();
      sleep(200).then(() => {
        expect(getNow() - now).toBeGreaterThan(200);
      });
    });

    it('getDeviceInfo', () => {
      expectTypeOf(getDeviceInfo()).toMatchTypeOf<{
        platform: string;
        userAgent: string;
        appName: string;
        appVersion: string;
        screenWidth: number;
        screenHeight: number;
        devicePixelRatio: number;
      }>();
    });

    it('safeGetGlobal', () => {
      expect(safeGetGlobal()).toBe(window);
    });

    it('getRandomString', () => {
      expect(getRandomString()).toHaveLength(8);
      expect(getRandomString(16)).toHaveLength(16);
      expect(getRandomString(32)).not.toHaveLength(16);
    });

    it('createLinkByString', () => {
      expect(createLinkByString('test')).toMatch(/^blob:/);
    });

    it('getAliAppEnv', () => {
      expectTypeOf(getAliAppEnv()).toEqualTypeOf<{
        appName: string;
        appVersion: string;
      }>();
    });
  });

  describe('verify', () => {
    it('isUndef', () => {
      expect(isUndef(undefined)).toBe(true);
      expect(isUndef(null)).toBe(false);
      expect(isUndef(0)).toBe(false);
      expect(isUndef('')).toBe(false);
      expect(isUndef(void 0)).toBe(true);
    });

    it('isNaN', () => {
      expect(isNaN(NaN)).toBe(true);
      expect(isNaN(0)).toBe(false);
      expect(isNaN('')).toBe(false);
      expect(isNaN(0 / 1)).toBe(false);
    });

    it('isNumber', () => {
      expect(isNumber(NaN)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber('')).toBe(false);
      expect(isNumber(0 / 1)).toBe(true);
      expect(isNumber(null)).toBe(false);
    });

    it('isString', () => {
      expect(isString(NaN)).toBe(false);
      expect(isString(0)).toBe(false);
      expect(isString('')).toBe(true);
      expect(isString(0 / 1)).toBe(false);
    });

    it('isPromise', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(0)).toBe(false);
      expect(isPromise('')).toBe(false);
      expect(isPromise(0 / 1)).toBe(false);
      expect(isPromise(new Promise(() => {}))).toBe(true);
      expect(isPromise({ then() {} })).toBe(true);
    });

    it('isEmpty', () => {
      expect(isEmpty(NaN)).toBe(true);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty(0 / 1)).toBe(false);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(true)).toBe(false);
      expect(isEmpty(new Set())).toBe(true);
      expect(isEmpty(new Set([1]))).toBe(false);
      expect(isEmpty(new Map())).toBe(true);
      expect(isEmpty(new Map([['a', 1]]))).toBe(false);
      expect(isEmpty(new WeakSet())).toBe(false);
      expect(isEmpty(new WeakSet([{}]))).toBe(false);
      expect(isEmpty(new WeakMap())).toBe(false);
      expect(isEmpty(new WeakMap([[{}, 'a']]))).toBe(false);
      expect(isEmpty(EMPTY)).toBe(true);
    });

    it('isFile', () => {
      expect(isFile(new File([], 'test'))).toBe(true);
      expect(isBlob(new Blob(['test']))).toBe(true);
      expect(isFile(NaN)).toBe(false);
      expect(isFile(0)).toBe(false);
      expect(isFile('')).toBe(false);
      expect(isFile(0 / 1)).toBe(false);
      expect(isFile(null)).toBe(false);
      expect(isFile(undefined)).toBe(false);
      expect(isFile([])).toBe(false);
      expect(isFile({})).toBe(false);
      expect(isFile({ a: 1 })).toBe(false);
      expect(isFile(true)).toBe(false);
      expect(isFile(new Set())).toBe(false);
      expect(isFile(new Set([1]))).toBe(false);
      expect(isFile(new Map())).toBe(false);
      expect(isFile(new Map([['a', 1]]))).toBe(false);
      expect(isFile(new WeakSet())).toBe(false);
      expect(isFile(new WeakSet([{}]))).toBe(false);
      expect(isFile(new WeakMap())).toBe(false);
      expect(isFile(new WeakMap([[{}, 'a']]))).toBe(false);
      expect(isFile(EMPTY)).toBe(false);
    });

    it('isBlob', () => {
      expect(isBlob(new File([], 'test'))).toBe(true);
      expect(isBlob(new Blob(['test']))).toBe(true);
      expect(isBlob(NaN)).toBe(false);
      expect(isBlob(0)).toBe(false);
      expect(isBlob('')).toBe(false);
      expect(isBlob(0 / 1)).toBe(false);
      expect(isBlob(null)).toBe(false);
      expect(isBlob(undefined)).toBe(false);
      expect(isBlob([])).toBe(false);
      expect(isBlob({})).toBe(false);
      expect(isBlob({ a: 1 })).toBe(false);
      expect(isBlob(true)).toBe(false);
      expect(isBlob(new Set())).toBe(false);
      expect(isBlob(new Set([1]))).toBe(false);
      expect(isBlob(new Map())).toBe(false);
      expect(isBlob(new Map([['a', 1]]))).toBe(false);
      expect(isBlob(new WeakSet())).toBe(false);
      expect(isBlob(new WeakSet([{}]))).toBe(false);
      expect(isBlob(new WeakMap())).toBe(false);
      expect(isBlob(new WeakMap([[{}, 'a']]))).toBe(false);
      expect(isBlob(EMPTY)).toBe(false);
    });

    it('isUrl', () => {
      expect(isUrl('https://www.taobao.com')).toBe(true);
      expect(isUrl('https://www.taobao.com?a=1')).toBe(true);
      expect(isUrl('https://www.taobao.com?a=1&b=2')).toBe(true);
      expect(isUrl('https://www.taobao.com?a=1&b=2#test')).toBe(true);
      expect(isUrl('//www.taobao.com')).toBe(true);
      expect(isUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')).toBe(true);
      expect(isUrl('blob:https://www.taobao.com')).toBe(true);
      expect(isUrl('http://www.taobao.com')).toBe(true);
      expect(isUrl('www.taobao.com')).toBe(false);
      expect(isUrl('')).toBe(false);
      expect(isUrl(0)).toBe(false);
      expect(isUrl(NaN)).toBe(false);
      expect(isUrl(null)).toBe(false);
      expect(isUrl(undefined)).toBe(false);
    });

    it('isTrue', () => {
      expect(isTrue(true)).toBe(true);
      expect(isTrue('true')).toBe(true);
      expect(isTrue('True')).toBe(true);
      expect(isTrue('TrUe')).toBe(true);
      expect(isTrue(false)).toBe(false);
      expect(isTrue(0)).toBe(false);
      expect(isTrue('')).toBe(false);
      expect(isTrue(NaN)).toBe(false);
      expect(isTrue(null)).toBe(false);
      expect(isTrue(undefined)).toBe(false);
    });

    it('isFalse', () => {
      expect(isFalse(false)).toBe(true);
      expect(isFalse('false')).toBe(true);
      expect(isFalse('False')).toBe(true);
      expect(isFalse('FaLsE')).toBe(true);
      expect(isFalse(true)).toBe(false);
      expect(isFalse(0)).toBe(false);
      expect(isFalse('')).toBe(false);
      expect(isFalse(NaN)).toBe(false);
      expect(isFalse(null)).toBe(false);
      expect(isFalse(undefined)).toBe(false);
    });

    it('isAsyncFunc', () => {
      expect(isAsyncFunc(async () => {})).toBe(true);
      expect(isAsyncFunc(() => {})).toBe(false);
      expect(isAsyncFunc(0)).toBe(false);
      expect(isAsyncFunc('')).toBe(false);
      expect(isAsyncFunc(0 / 1)).toBe(false);
    });
  });

  describe('funcHandler', () => {
    it('memoize', () => {
      const func = memoize((...args: any[]) => ({}));
      const fastCall = func();
      expectTypeOf(fastCall).toEqualTypeOf<{}>();
      expect(func()).toBe(fastCall);
      const key = {};
      const value = {};
      func.cache.set(key, value);
      expect(func(key)).not.toBe({});
      expect(func(key)).toBe(value);
      expect(func()).not.toBe(value);

      const func2 = memoize(
        (...args: any[]) => ({}),
        (...args: any[]) => args[1],
      );
      const func2FastCall = func2();
      expect(func2()).toBe(func2FastCall);
      expect(func2(1)).toBe(func2FastCall);
      expect(func2(1, 2)).not.toBe(func2FastCall);
      func2.cache.set(2, value);
      expect(func2(1, 2)).toBe(value);
      expect(func2(1, 2)).not.toBe(func2FastCall);
    });

    it('curry', () => {
      const func = curry((a: number, b: number, c: number) => a + b + c);
      const fastCall = func(1);
      // @ts-expect-error
      expectTypeOf(fastCall).toEqualTypeOf<Function>();
      const secondCall = fastCall(2);
      // @ts-expect-error
      expectTypeOf(secondCall).toEqualTypeOf<Function>();
      const thirdCall = secondCall(3);
      expectTypeOf(thirdCall).toEqualTypeOf<number>();
      expect(thirdCall).toBe(6);
      expect(func(1, 2, 3)).toBe(6);
      expect(func(1)(2)(3)).toBe(6);
      expect(func(1, 2)(3)).toBe(6);
      expect(func(1)(2, 3)).toBe(6);
      expect(secondCall(4)).toBe(7);

      const sum = curry((a: number, b: number) => a + b);
      const sum2 = curry(compose(sum(1), (a: number, b: number) => a * 2 + b));
      expect(sum2(2, 3)).toBe(8);
      expect(sum2(2)(3)).toBe(8);

      const sum3 = curry(pipe((a: number, b: number) => a * 2 + b, sum(1)));
      // @ts-expect-error
      expect(sum3.clength).toBe(2);
      expect(sum3(2, 3)).toBe(8);
      // @ts-expect-error
      expect(sum3(2).clength).toBe(1);
      expect(sum3(2)(3)).toBe(8);

      expect(() => curry((...args: any[]) => {})).toThrowErrorMatchingInlineSnapshot(
        `[TypeError: 无法读取函数参数列表的长度，不能使用可选参数和剩余参数！！！]`,
      );
    });

    it('sleep', () => {
      const now = getNow();
      expect(sleep(100))
        .resolves.toBeUndefined()
        .then(() => {
          expect(getNow() - now).toBeGreaterThanOrEqual(100);
        });
    });

    it('reverseArgs', () => {
      const func = reverseArgs((a: string, b: number) => a + b);
      expect(func(1, '2')).toBe('21');
    });

    it('throttle', async ({ expect }) => {
      let count = 0;
      const func = throttle(() => {
        ++count;
      }, 100);
      func();
      func();
      expect(count).toBe(1);

      await sleep(100);
      func();
      func();
      expect(count).toBe(2);
      const func2 = throttle(
        () => {
          ++count;
        },
        100,
        false,
      );
      func2();
      func2();
      expect(count).toBe(2);
      await sleep(100);
      expect(count).toBe(3);

      const func3 = throttle(() => {
        ++count;
      }, 0);
      func3();
      expect(count).toBe(4);
      func3();
      expect(count).toBe(5);
    });

    it('debounce', async ({ expect }) => {
      let count = 0;
      const func = debounce(() => {
        ++count;
      }, 100);

      func();
      func();
      expect(count).toBe(0);

      const func2 = debounce(
        () => {
          ++count;
        },
        100,
        true,
      );

      func2();
      expect(count).toBe(1);
      await sleep(100);
      func();
      func();
      expect(count).toBe(2);
      await sleep(100);
      expect(count).toBe(3);
      func2();
      func2();
      expect(count).toBe(4);
      await sleep(100);
      expect(count).toBe(4);

      const func3 = debounce(() => {
        ++count;
      }, 0);
      func3();
      expect(count).toBe(5);
      func3();
      expect(count).toBe(6);
    });

    it('compose', () => {
      const func = compose(
        (a: number) => a * 2,
        (a: number, b: number) => a + b,
      );
      expect(func(1, 2)).toBe(6);

      // @ts-expect-error
      const func2 = compose();
      expect(func2(1, 2)).toBe(1);
      expect(func2(1)).toBe(1);

      // @ts-expect-error
      const func3 = compose((a: number) => a * 2);
      expect(func3(1, 2)).toBe(2);
      expect(func3(1)).toBe(2);

      const sum = curry((a: number, b: number) => a + b);
      const func4 = compose(sum(1), (a: number, b: number) => a * 2 + b);
      expect(func4(2, 3)).toBe(8);
    });

    it('pipe', () => {
      const func = pipe(
        (a: number, b: number) => a + b,
        (a: number) => a * 2,
      );
      expect(func(1, 2)).toBe(6);

      // @ts-expect-error
      const func2 = pipe();
      // @ts-expect-error
      expect(func2(1, 2)).toBe(1);
      // @ts-expect-error
      expect(func2(1)).toBe(1);

      // @ts-expect-error
      const func3 = pipe((a: number) => a * 2);
      // @ts-expect-error
      expect(func3(1)).toBe(2);
      // @ts-expect-error
      expect(func3(1)).toBe(2);

      const sum = curry((a: number, b: number) => a + b);
      const func4 = pipe((a: number, b: number) => a * 2 + b, sum(1));
      expect(func4(2, 3)).toBe(8);
    });

    it('chunkTask', () => {
      const func = chunkTask((a: number, b: number = 0) => {
        sleepSync(16);
        return a + b;
      });
      expect(
        func([
          [1, 2],
          [3, 4],
          [5, 6],
        ]),
      ).resolves.toEqual([3, 7, 11]);

      expect(func(10)).resolves.toEqual(Array.from({ length: 10 }, (_, i) => i));

      expect(
        chunkTask(() => {
          throw new Error('error');
        })(3),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: error]`);
    });
  });
});
