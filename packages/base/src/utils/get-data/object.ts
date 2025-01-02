import type { TMany, TObject, TObjKeyType } from '$/types/base';
import { curry } from '$/fp/utils';
import ms from 'ms';
import { getArray } from '../data-handler';
import { cacheByReturn } from '../func-handler';
import { isAliMiniApp, isByteDanceMicroApp, isMiniApp, isNode, isWeb, isWeChatMiniProgram, isWeex } from '../ua';
import { isEmpty, isString } from '../verify';
import { getOsType, getUserAgent } from './string';

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

export const getAliAppEnv = cacheByReturn((): { appName: string; appVersion: string } => {
  let appNameI = '';
  let appVersionI = '';
  if (isWeb() || isNode()) {
    const ua = getUserAgent();
    if (ua) {
      const matched = ua.match(/AliApp\(([\w-]+)\/([\d.]+)\)/i);
      if (matched) {
        [, appNameI, appVersionI] = matched.map((item: any) => (isString(item) ? item.toLowerCase() : item));
      }
    }
  }
  else if (isAliMiniApp()) {
    const systemInfo = my.getSystemInfoSync() || {};
    const { version = '', app = '' } = systemInfo;
    appNameI = app.toLowerCase();
    appVersionI = version.toLowerCase();
  }
  return { appName: appNameI, appVersion: appVersionI };
});

export const getDeviceInfo = cacheByReturn(
  (): {
    appName: string;
    appVersion: string;
    screenWidth: number;
    screenHeight: number;
    devicePixelRatio: number;
    platform: string;
    userAgent: string;
  } => {
    const baseInfo = {
      platform: getOsType(),
      userAgent: getUserAgent(),
    };
    if (isWeb()) {
      return {
        ...baseInfo,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio,
      };
    }
    if (isWeex()) {
      return {
        ...baseInfo,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        screenWidth: window.screen.width / window.devicePixelRatio,
        screenHeight: window.screen.height / window.devicePixelRatio,
        devicePixelRatio: window.devicePixelRatio,
      };
    }
    if (isMiniApp()) {
      const systemInfo = my.getSystemInfoSync() || {};
      return {
        ...baseInfo,
        appName: systemInfo.app,
        appVersion: systemInfo.version,
        platform: systemInfo.platform,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight,
        devicePixelRatio: systemInfo.pixelRatio,
      };
    }
    if (isWeChatMiniProgram()) {
      const systemInfo = wx?.getSystemInfoSync?.() || {};
      return {
        ...baseInfo,
        appName: 'wechat',
        appVersion: systemInfo.version,
        platform: systemInfo.platform,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight,
        devicePixelRatio: systemInfo.pixelRatio,
      };
    }
    if (isByteDanceMicroApp()) {
      const systemInfo = tt.getSystemInfoSync() || {};
      return {
        ...baseInfo,
        appName: 'bytedance',
        appVersion: systemInfo.version,
        platform: systemInfo.platform,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight,
        devicePixelRatio: systemInfo.pixelRatio,
      };
    }
    return {
      ...baseInfo,
      appName: '',
      appVersion: '',
      platform: '',
      screenWidth: 0,
      screenHeight: 0,
      devicePixelRatio: 0,
    };
  },
);