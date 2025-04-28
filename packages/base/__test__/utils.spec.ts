/* eslint-disable */
// @vitest-environment happy-dom
// @ts-nocheck

import { describe, expect, expectTypeOf, inject, it } from 'vitest';

describe('utils', async () => {
  const {
    asyncFilter,
    asyncReplace,
    chunkTask,
    cloneMerge,
    compose,
    createLinkByString,
    curry,
    debounce,
    deepClone,
    INTERNAL_EMPTY: EMPTY,
    gc,
    generateClassName,
    generateCookieInfo,
    getAliAppEnv,
    getArray,
    getArraySlice,
    getDeviceInfo,
    getNow,
    getRandomString,
    getType,
    isAliApp,
    isAliAppMiniApp,
    isAliAppWeb,
    isAliMiniApp,
    isAliMiniappPlatform,
    isAliPay,
    isAlipayApp,
    isAlipayMiniapp,
    isAlipayMiniWeb,
    isAliPayWeb,
    isAliUa,
    isAliWebInMiniApp,
    isAndroid,
    isAsyncFunc,
    isBaiduSmartProgram,
    isBlob,
    isByteDanceMicroApp,
    isCaiNiao,
    isCaiNiaoApp,
    isCaiNiaoBusiness,
    isChrome,
    isDingdingMiniapp,
    isDingTalk,
    isEdge,
    isEmpty,
    isFalse,
    isFile,
    isFirefox,
    isHmApp,
    isIOS,
    isIOSNotchScreen,
    isIPhone14PM,
    isIPhoneX,
    isIPhoneXR,
    isIPhoneXSMax,
    isKraken,
    isKuaiShouMiniProgram,
    isLBMiniWeb,
    isLST,
    isLT,
    isLTMiniapp,
    isLTMiniWeb,
    isLTNode,
    isLTWeb,
    isLXB,
    isMiniApp,
    isMMCMiniapp,
    isNaN,
    isNewEdge,
    isNode,
    isNumber,
    isOldEdge,
    isOpenHarmony,
    isPromise,
    isQuickApp,
    isSafari,
    isString,
    isTaobaoMiniapp,
    isTB,
    isTbLive,
    isTBMiniapp,
    isTBMiniWeb,
    isTBNode,
    isTBWeb,
    isTbWebEnv,
    isTmall,
    isTrue,
    isTuan,
    isTuanWebview,
    isUndef,
    isUrl,
    isWeb,
    isWebInDingding,
    isWebInMiniApp,
    isWechat,
    isWechatH5,
    isWeChatMiniProgram,
    isWechatMiniWeb,
    isWechatNode,
    isWechatWeb,
    isWeex,
    isXiNiaoapp,
    isYouKu,
    memoize,
    merge,
    pipe,
    reverseArgs,
    safeGetGlobal,
    sleep,
    sleepSync,
    throttle,
    getSpace,
    tryOrErrorFunc,
    tryOrErrorAsyncFunc
  } = await (() => {
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

  describe('getData', () => {
    it('getSpace', ({ expect }) => {
      expect(getSpace()).toMatchInlineSnapshot(`" "`);
      expect(getSpace(1)).toMatchInlineSnapshot(`" "`);
      expect(getSpace(2)).toMatchInlineSnapshot(`"  "`);
      expect(getSpace(0)).toMatchInlineSnapshot(`""`);
    });
    it('generateCookieInfo', ({ expect }) => {
      expect(generateCookieInfo()).toMatchInlineSnapshot(`""`);
      expect(generateCookieInfo({})).toMatchInlineSnapshot(`""`);
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
          domain: '.taobao.com',
          path: '/',
          maxAge: 1000,
        }),
      ).toMatchInlineSnapshot(`"domain=.taobao.com;max-age=1000;path=/;"`);
      expect(() =>
        generateCookieInfo({
          data: { name: 'test', value: '123' },
          domain: '.taobao.com',
          path: '/',
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
      expect(getType(() => {})).toBe('function');
      expect(getType(async () => {})).toBe('asyncfunction');
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
        expect(Math.ceil(Math.ceil(getNow() - now))).toBeGreaterThanOrEqual(200);
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
      expect(isNaN(Number.NaN)).toBe(true);
      expect(isNaN(0)).toBe(false);
      expect(isNaN('')).toBe(false);
      expect(isNaN(0 / 1)).toBe(false);
    });

    it('isNumber', () => {
      expect(isNumber(Number.NaN)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber('')).toBe(false);
      expect(isNumber(0 / 1)).toBe(true);
      expect(isNumber(null)).toBe(false);
    });

    it('isString', () => {
      expect(isString(Number.NaN)).toBe(false);
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
      expect(isEmpty(Number.NaN)).toBe(true);
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
      expect(isFile(Number.NaN)).toBe(false);
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
      expect(isBlob(Number.NaN)).toBe(false);
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
      expect(isUrl(Number.NaN)).toBe(false);
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
      expect(isTrue(Number.NaN)).toBe(false);
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
      expect(isFalse(Number.NaN)).toBe(false);
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
      expectTypeOf(fastCall).toEqualTypeOf<Function>();
      const secondCall = fastCall(2);
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
      expect(sum3.clength).toBe(2);
      expect(sum3(2, 3)).toBe(8);
      expect(sum3(2).clength).toBe(1);
      expect(sum3(2)(3)).toBe(8);

      expect(() => curry((...args: any[]) => {})).toThrowErrorMatchingInlineSnapshot(
        `[TypeError: 无法读取函数参数列表的长度，不能使用可选参数和剩余参数！！！]`,
      );
    });

    it('sleep', () => {
      const now = getNow();
      expect(sleep(100))
        .resolves
        .toBeUndefined()
        .then(() => {
          expect(Math.ceil(getNow() - now)).toBeGreaterThanOrEqual(100);
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

      const func2 = compose();
      expect(func2(1, 2)).toBe(1);
      expect(func2(1)).toBe(1);

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

      const func2 = pipe();
      expect(func2(1, 2)).toBe(1);
      expect(func2(1)).toBe(1);

      const func3 = pipe((a: number) => a * 2);
      expect(func3(1)).toBe(2);
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

    it('errorHandler', () => {
      const presetError = new Error('error self');

      const func = function (flag: 'this' | 'error' | 'pass') {
        if (flag === 'this') {
          return this;
        }

        if (flag === 'error') {
          throw presetError;
        }

        return 'pass';
      }

      const obj = {
        func: tryOrErrorFunc(func),
        asyncFunc: tryOrErrorAsyncFunc(func)
      };

      expect(obj.func('this')).toStrictEqual([null, obj]);
      expect(obj.func('error')).toEqual([presetError, null])
      expect(obj.func('pass')).toEqual([null, 'pass']);

      expect(obj.asyncFunc('this')).resolves.toStrictEqual([null, obj]);
      expect(obj.asyncFunc('error')).resolves.toEqual([presetError, null])
      expect(obj.asyncFunc('pass')).resolves.toEqual([null, 'pass']);
    })
  });

  describe('datahandler', () => {
    it('getArray', ({ expect }) => {
      expect(getArray([])).toStrictEqual([]);
      expect(getArray([1, 2, 3])).toStrictEqual([1, 2, 3]);
      expect(getArray(1)).toEqual([1]);
      expect(getArray(null)).toEqual([]);
      expect(getArray()).toEqual([]);
    });

    it('getArraySlice', () => {
      expect(getArraySlice([], 0)).toEqual([[]]);
      expect(getArraySlice([1, 2, 3], 0)).toEqual([[1, 2, 3]]);
      expect(getArraySlice([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
      expect(getArraySlice([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
      expect(getArraySlice([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
      expect(getArraySlice([1, 2, 3], 4)).toEqual([[1, 2, 3]]);
      expect(getArraySlice([1, 2, 3], 2, 1)).toEqual([[2, 3]]);
      expect(getArraySlice([1, 2, 3], 2, 2)).toEqual([[3]]);
      expect(getArraySlice([1, 2, 3], 2, 3)).toEqual([]);
      expect(getArraySlice([1, 2, 3])).toEqual([[1, 2, 3]]);
    });

    it('deepClone', () => {
      const obj = { a: 1, b: { c: 2 } };
      expect(deepClone(obj)).toEqual({ a: 1, b: { c: 2 } });
      expect(deepClone(obj)).not.toBe(obj);
      expect(deepClone(obj).b).not.toBe(obj.b);
      const arr = [1, obj, 2];
      expect(deepClone(arr)).toEqual([1, { a: 1, b: { c: 2 } }, 2]);
      expect(deepClone(arr)).not.toBe(arr);
      expect(deepClone(arr)[1]).not.toBe(arr[1]);
      expect(deepClone(arr)[1].b).not.toBe(arr[1].b);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
      obj.arr = arr;
      const dcObj = deepClone(obj);
      expect(dcObj.arr[1].b).not.toBe(obj.arr[1].b);
      expect(dcObj.arr[1].arr[1].arr[1]).not.toBe(obj.arr[1].arr[1].arr[1]);
      expect(deepClone(Number.NaN)).toBe(Number.NaN);
      expect(deepClone(0)).toBe(0);
      expect(deepClone(0 / 1)).toBe(0 / 1);
      expect(deepClone(true)).toBe(true);
      expect(deepClone('false')).toBe('false');
    });

    it('merge', () => {
      expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
      expect(merge({ a: 1 }, null)).toEqual({ a: 1 });
      expect(merge('string:', undefined)).toEqual('string:');
      expect(merge('string:', '123123')).toEqual('string:123123');
      expect(merge(1, 123)).toEqual(124);
      expect(merge([], [1, 2, 3])).toEqual([1, 2, 3]);
      expect(merge([10, 20, 30], [1, 2, 3])).toEqual([10, 20, 30, 1, 2, 3]);
      expect(merge({ a: 1, arr: [1, 2, 3] }, { b: 2 })).toEqual({ a: 1, arr: [1, 2, 3], b: 2 });
      expect(merge({ a: 1 }, { b: 2, arr: [1, 2, 3] })).toEqual({ a: 1, arr: [1, 2, 3], b: 2 });
      expect(merge({ a: 1, obj: { c: 1 } }, { b: 2 })).toEqual({ a: 1, obj: { c: 1 }, b: 2 });
      expect(merge({ a: 1 }, { b: 2, obj: { c: 1 } })).toEqual({ a: 1, obj: { c: 1 }, b: 2 });
      expect(merge({ a: 1, d: null }, { b: 2, obj: { c: 1 } }, { d: 123 })).toEqual({
        a: 1,
        obj: { c: 1 },
        b: 2,
        d: 123,
      });
      expect(merge({ a: 1, d: 0 }, { b: 2, obj: { c: 1 } }, { d: 123 })).toEqual({
        a: 1,
        obj: { c: 1 },
        b: 2,
        d: 0,
      });
      const obj = { a: 1 };
      const obj2 = { c: 1 };
      const obj3 = { obj: obj2 };
      const mobj = merge(obj, obj2, obj3);
      expect(mobj).toEqual({ a: 1, c: 1, obj: { c: 1 } });
      expect(mobj).toBe(obj);
      expect(mobj.obj).not.toBe(obj2);
    });

    it('cloneMerge', () => {
      expect(cloneMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
      expect(cloneMerge({ a: 1 }, null)).toEqual({ a: 1 });
      expect(cloneMerge('string:', undefined)).toEqual('string:');
      expect(cloneMerge('string:', '123123')).toEqual('string:123123');
      expect(cloneMerge(1, 123)).toEqual(124);
      expect(cloneMerge([], [1, 2, 3])).toEqual([1, 2, 3]);
      expect(cloneMerge([10, 20, 30], [1, 2, 3])).toEqual([10, 20, 30, 1, 2, 3]);
      expect(cloneMerge({ a: 1, arr: [1, 2, 3] }, { b: 2 })).toEqual({ a: 1, arr: [1, 2, 3], b: 2 });
      expect(cloneMerge({ a: 1 }, { b: 2, arr: [1, 2, 3] })).toEqual({ a: 1, arr: [1, 2, 3], b: 2 });
      expect(cloneMerge({ a: 1, obj: { c: 1 } }, { b: 2 })).toEqual({ a: 1, obj: { c: 1 }, b: 2 });
      expect(cloneMerge({ a: 1 }, { b: 2, obj: { c: 1 } })).toEqual({ a: 1, obj: { c: 1 }, b: 2 });
      expect(cloneMerge({ a: 1, d: null }, { b: 2, obj: { c: 1 } }, { d: 123 })).toEqual({
        a: 1,
        obj: { c: 1 },
        b: 2,
        d: 123,
      });
      expect(cloneMerge({ a: 1, d: 0 }, { b: 2, obj: { c: 1 } }, { d: 123 })).toEqual({
        a: 1,
        obj: { c: 1 },
        b: 2,
        d: 0,
      });
      const obj = { a: 1 };
      const obj2 = { c: 1 };
      const obj3 = { obj: obj2 };
      const mobj = cloneMerge(obj, obj2, obj3);
      expect(mobj).toEqual({ a: 1, c: 1, obj: { c: 1 } });
      expect(mobj).not.toBe(obj);
      expect(mobj.obj).not.toBe(obj2);
    });

    it('asyncReplace', async ({ expect }) => {
      const repFunc = (reg, func) => asyncReplace('123456789', reg, func);
      expect(
        repFunc(/[13579]/, async () => {
          await sleep(25);
          return 'a';
        }),
      ).resolves.toBe('a23456789');
      expect(
        repFunc(/[13579]/g, async () => {
          await sleep(25);
          return 'a';
        }),
      ).resolves.toBe('a2a4a6a8a');
      expect(repFunc(/[13579]/, 'a')).resolves.toBe('a23456789');
      expect(repFunc('1', 'a')).resolves.toBe('a23456789');
      expect(
        repFunc('1', async () => {
          await sleep(25);
          return 'a';
        }),
      ).resolves.toBe('a23456789');
      expect(repFunc(null, 'a')).resolves.toMatchInlineSnapshot(`"123456789"`);
      expect(repFunc(null, () => 'a')).resolves.toMatchInlineSnapshot(`"123456789"`);
      expect(repFunc(null, async () => 'a')).resolves.toMatchInlineSnapshot(`"123456789"`);
      expect(
        repFunc('1', async () => {
          throw new Error('test');
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: test]`);
      expect(repFunc('1', 1)).rejects.toThrowErrorMatchingInlineSnapshot(`[TypeError: replacer 必须是字符串或函数]`);
      expect(repFunc('1', null)).rejects.toThrowErrorMatchingInlineSnapshot(`[TypeError: replacer 必须是字符串或函数]`);
      expect(repFunc('1')).rejects.toThrowErrorMatchingInlineSnapshot(`[TypeError: replacer 必须是字符串或函数]`);
      expect(repFunc()).rejects.toThrowErrorMatchingInlineSnapshot(`[TypeError: replacer 必须是字符串或函数]`);
      expect(
        repFunc(/[2468]/g, async () => {
          throw new Error('test');
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: test]`);
      expect(
        repFunc(/[2468]/, () => {
          throw new Error('test');
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: test]`);
      expect(
        repFunc(/[2468]/g, () => {
          throw new Error('test');
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: test]`);
      expect(
        repFunc(/a/, async () => {
          throw new Error('test');
        }),
      ).resolves.toBe('123456789');
    });

    it('asyncFilter', async ({ expect }) => {
      const fltFunc = func => asyncFilter([1, 2, 3, 4, 5, 6, 7, 8, 9], func);
      expect(fltFunc((_, i) => i % 2)).resolves.toEqual([2, 4, 6, 8]);
      const now = getNow();
      expect(
        fltFunc(async (_, i) => {
          await sleep(25);
          return i % 2;
        }).then((res) => {
          expect(getNow() - now, '判断是否是并发替换的').toBeLessThanOrEqual(60);
          return res;
        }),
      ).resolves.toEqual([2, 4, 6, 8]);
      expect(fltFunc()).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(fltFunc(1)).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(fltFunc('1')).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(fltFunc(true)).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(fltFunc(false)).resolves.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(asyncFilter()).rejects.toThrowErrorMatchingInlineSnapshot(`[TypeError: arr 必须是数组]`);
    });
  });

  describe('ua', () => {
    it('ua', () => {
      expectTypeOf(isNode()).toEqualTypeOf<boolean>();
      expectTypeOf(isWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isIOS()).toEqualTypeOf<boolean>();
      expectTypeOf(isAndroid()).toEqualTypeOf<boolean>();
      expectTypeOf(isChrome()).toEqualTypeOf<boolean>();
      expectTypeOf(isFirefox()).toEqualTypeOf<boolean>();
      expectTypeOf(isSafari()).toEqualTypeOf<boolean>();
      expectTypeOf(isNewEdge()).toEqualTypeOf<boolean>();
      expectTypeOf(isOldEdge()).toEqualTypeOf<boolean>();
      expectTypeOf(isEdge()).toEqualTypeOf<boolean>();
      expectTypeOf(isWeex()).toEqualTypeOf<boolean>();
      expectTypeOf(isKraken()).toEqualTypeOf<boolean>();
      expectTypeOf(isQuickApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isTBWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isLTWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isTbLive()).toEqualTypeOf<boolean>();
      expectTypeOf(isTbWebEnv()).toEqualTypeOf<boolean>();
      expectTypeOf(isWechatWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isAliPayWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isWebInDingding()).toEqualTypeOf<boolean>();
      expectTypeOf(isTuan()).toEqualTypeOf<boolean>();
      expectTypeOf(isLST()).toEqualTypeOf<boolean>();
      expectTypeOf(isLXB()).toEqualTypeOf<boolean>();
      expectTypeOf(isAliAppWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isMiniApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isAliMiniApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isDingdingMiniapp()).toEqualTypeOf<boolean>();
      expectTypeOf(isTaobaoMiniapp()).toEqualTypeOf<boolean>();
      expectTypeOf(isAlipayMiniapp()).toEqualTypeOf<boolean>();
      expectTypeOf(isTBMiniapp()).toEqualTypeOf<boolean>();
      expectTypeOf(isLTMiniapp()).toEqualTypeOf<boolean>();
      expectTypeOf(isMMCMiniapp()).toEqualTypeOf<boolean>();
      expectTypeOf(isXiNiaoapp()).toEqualTypeOf<boolean>();
      expectTypeOf(isCaiNiaoApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isAlipayApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isByteDanceMicroApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isBaiduSmartProgram()).toEqualTypeOf<boolean>();
      expectTypeOf(isKuaiShouMiniProgram()).toEqualTypeOf<boolean>();
      expectTypeOf(isWeChatMiniProgram()).toEqualTypeOf<boolean>();
      expectTypeOf(isAliMiniappPlatform()).toEqualTypeOf<boolean>();
      expectTypeOf(isTBNode()).toEqualTypeOf<boolean>();
      expectTypeOf(isLTNode()).toEqualTypeOf<boolean>();
      expectTypeOf(isWechatNode()).toEqualTypeOf<boolean>();
      expectTypeOf(isTB()).toEqualTypeOf<boolean>();
      expectTypeOf(isLT()).toEqualTypeOf<boolean>();
      expectTypeOf(isAliPay()).toEqualTypeOf<boolean>();
      expectTypeOf(isTmall()).toEqualTypeOf<boolean>();
      expectTypeOf(isAliApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isWechat()).toEqualTypeOf<boolean>();
      expectTypeOf(isCaiNiaoBusiness()).toEqualTypeOf<boolean>();
      expectTypeOf(isCaiNiao()).toEqualTypeOf<boolean>();
      expectTypeOf(isAliUa()).toEqualTypeOf<boolean>();
      expectTypeOf(isHmApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isYouKu()).toEqualTypeOf<boolean>();
      expectTypeOf(isAlipayMiniWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isLTMiniWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isLBMiniWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isTBMiniWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isDingTalk()).toEqualTypeOf<boolean>();
      expectTypeOf(isTuanWebview()).toEqualTypeOf<boolean>();
      expectTypeOf(isWechatMiniWeb()).toEqualTypeOf<boolean>();
      expectTypeOf(isWechatH5()).toEqualTypeOf<boolean>();
      expectTypeOf(isWebInMiniApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isAliWebInMiniApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isAliAppMiniApp()).toEqualTypeOf<boolean>();
      expectTypeOf(isOpenHarmony()).toEqualTypeOf<boolean>();
      expectTypeOf(isIPhoneX()).toEqualTypeOf<boolean>();
      expectTypeOf(isIPhoneXSMax()).toEqualTypeOf<boolean>();
      expectTypeOf(isIPhoneXR()).toEqualTypeOf<boolean>();
      expectTypeOf(isIPhone14PM()).toEqualTypeOf<boolean>();
      expectTypeOf(isIOSNotchScreen()).toEqualTypeOf<boolean>();
    });
  });
});
