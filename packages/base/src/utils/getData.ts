import type { TMany, TObject, TObjKeyType } from '../types/base';

import ms from 'ms';
import { cacheByReturn, isByteDanceMicroApp, isMiniApp, isWeb, isWeChatMiniProgram, isWeex } from '../cirDep';
import { curry } from '../cirDep/funcHandler';

import { getArray } from './dataHandler';
import { isEmpty } from './verify';

export const safeGetGlobal = cacheByReturn((): any => {
  if (isWeb())
    return window;
  if (globalThis)
    return globalThis;
  if (isWeex())
    return weex;
  if (isMiniApp())
    return my;
  if (isWeChatMiniProgram())
    return wx;
  if (isByteDanceMicroApp())
    return tt;
  return {};
});

export const getNow = cacheByReturn(() => {
  if (typeof performance !== 'undefined') {
    return () => performance.now();
  }
  return () => Date.now();
});

export function getRandomString(len = 8): string {
  const str = Math.random()
    .toString(36)
    .slice(2, len + 2);
  if (str.length === len) {
    return str;
  }
  return str + getRandomString(len - str.length);
}

export function createLinkByString(resource: BlobPart) {
  const blob = new Blob([resource]);
  const url = URL.createObjectURL(blob);
  return url;
}

export interface CookieOptions {
  duration?: number;
  expires?: string | Date;
  domain?: string;
  maxAge?: number;
  path?: string;
}

export function generateCookieInfo(options: CookieOptions = {}) {
  const { duration, expires, domain, maxAge, path } = options;
  let infoString = '';
  if (isEmpty(options))
    return infoString;
  if (duration) {
    const date = new Date();
    date.setTime(date.getTime() + duration);
    infoString += `expires=${date.toUTCString()};`;
  }
  else if (expires) {
    if (typeof expires === 'string') {
      const date = new Date();
      date.setTime(date.getTime() + ms(expires));
      infoString += `expires=${date.toUTCString()};`;
    }
    else if (expires instanceof Date) {
      infoString += `expires=${expires.toUTCString()};`;
    }
    else {
      throw new TypeError('expires 必须是字符串或 Date (推荐使用Date)');
    }
  }
  if (domain) {
    infoString += `domain=${domain};`;
  }
  if (maxAge) {
    infoString += `max-age=${maxAge};`;
  }
  if (path) {
    infoString += `path=${path};`;
  }
  return infoString;
}

type GCArgs =
  | string
  | (undefined | null | string | Record<string, boolean>)[]
  | Record<string, boolean>
  | undefined
  | null;

export function generateClassName(...args: GCArgs[]) {
  if (!args.length)
    return '';
  const className: string = args
    .map((arg) => {
      if (typeof arg === 'string') {
        return arg;
      }
      else if (Array.isArray(arg)) {
        return generateClassName(...arg);
      }
      else if (typeof arg === 'object' && arg !== null) {
        return Object.keys(arg)
          .filter(key => arg[key])
          .join(' ');
      }
      else {
        return '';
      }
    })
    .join(' ')
    .replace(/\s+/g, ' ');
  return className.trimEnd();
}

/**
 * @alias generateClassName
 */
export const gc = generateClassName;

export function withResolvers<T>(func?: (resolve: (value: T) => void, reject: (reason?: any) => void) => any) {
  let resolve: (value: T) => void = () => {};
  let reject: (reason?: any) => void = () => {};
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
    func?.(res, rej);
  });
  return { resolve, reject, promise };
}

export const pick = curry((keys: TMany<TObjKeyType>, obj: TObject<any>): TObject<any> => {
  const result = {};
  const keyList = getArray(keys);
  // @ts-expect-error any
  keyList.forEach((key: any) => (result[key] = obj[key]));
  return result;
});

export const omit = curry((keys: TMany<TObjKeyType>, obj: TObject<any>): TObject<any> => {
  const result = {};
  const keyList = getArray(keys) as any[];
  Object.keys(obj).forEach((key) => {
    if (!keyList.includes(key))
      // @ts-expect-error any
      result[key] = obj[key];
  });
  return result;
});
