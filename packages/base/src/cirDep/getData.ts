import { TAllType } from '../types/base';

import { cacheByReturn } from './funcHandler';
import { getUserAgent } from './getUserAgent';
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
import { isString } from './verify';

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

export function getType(value: any): TAllType {
  const baseType = typeof value;
  if (baseType !== 'object' && baseType !== 'function') return baseType;
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
