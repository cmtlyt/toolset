import ms from 'ms';

import { cacheByReturn } from './funcHandler';
import {
  isAliMiniApp,
  isAndroid,
  isByteDanceMicroApp,
  isIOS,
  isMiniApp,
  isNode,
  isOpenHarmony,
  isWeb,
  isWeChatMiniProgram,
  isWeex,
} from './ua';
import { isEmpty, isString } from './verify';

export const getOsType = cacheByReturn(() => {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  if (isOpenHarmony()) return 'openHarmony';
  if (isNode()) {
    const platform = process.platform;
    if (platform === 'darwin') return 'mac';
    if (platform === 'win32') return 'windows';
    if (platform === 'linux') return 'linux';
    return platform;
  }
  return 'other';
});

export const getUserAgent = cacheByReturn((): string => {
  if (globalThis.navigator) {
    // @ts-expect-error env
    return globalThis.navigator.userAgent || globalThis.navigator.swuserAgent;
  } else if (process) {
    return `Node.js/${process.version} (${process.platform}; ${process.arch}) ${process.env.SHELL} ${process.env.LANG} ${process.env.TERM_PROGRAM}`;
  }
  return '';
});

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
  } else if (isAliMiniApp()) {
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

export const safeGetGlobal = cacheByReturn((): any => {
  if (isWeb()) return window;
  if (globalThis) return globalThis;
  if (isWeex()) return weex;
  if (isMiniApp()) return my;
  if (isWeChatMiniProgram()) return wx;
  if (isByteDanceMicroApp()) return tt;
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
    .toString(32)
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
  data?: {
    name: string;
    value: string;
  };
}

export function generateCookieInfo(options: CookieOptions = {}) {
  const { duration, expires, domain, maxAge, path, data } = options;
  let infoString = data ? `${data.name}=${data.value};` : '';
  if (isEmpty(options)) return infoString;
  if (duration) {
    const date = new Date();
    date.setTime(date.getTime() + duration);
    infoString += `expires=${date.toUTCString()};`;
  } else if (expires) {
    if (typeof expires === 'string') {
      const date = new Date();
      date.setTime(date.getTime() + ms(expires));
      infoString += `expires=${date.toUTCString()};`;
    } else if (expires instanceof Date) {
      infoString += `expires=${expires.toUTCString()};`;
    } else {
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
  if (!args.length) return '';
  const className = args
    .map((arg) => {
      if (typeof arg === 'string') {
        return arg;
      } else if (Array.isArray(arg)) {
        return generateClassName(...arg);
      } else if (typeof arg === 'object' && arg !== null) {
        return Object.keys(arg)
          .filter((key) => arg[key])
          .join(' ');
      } else {
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

export function getType(value: any): string {
  const baseType = typeof value;
  if (baseType !== 'object' && baseType !== 'function') return baseType;
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
