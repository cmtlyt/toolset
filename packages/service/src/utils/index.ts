import {
  isWeb,
  isDingTalk,
  isByteDanceMicroApp,
  isWeChatMiniProgram,
  isTB,
  isAliPay,
  cacheByReturn,
} from '@cmtlyt/base';

import { APIConfig, FilterBaseAPIConfig, PlatformAPIConfig } from '../types';

export const getPlatformType = cacheByReturn(() => {
  if (isWeb()) return 'web';
  if (isDingTalk()) return 'dingtalk';
  if (isByteDanceMicroApp()) return 'bytedance';
  if (isWeChatMiniProgram()) return 'wechat';
  if (isTB()) return 'taobao';
  if (isAliPay()) return 'alipay';
  return 'other';
});

export const getConfigHandler = (getPlatformHandler = getPlatformType) => {
  return cacheByReturn(() => {
    const platform = getPlatformHandler();
    return (config: PlatformAPIConfig) => {
      let temp = config[platform];
      if (typeof temp === 'function') {
        temp = temp(platform);
      }
      return temp ? { ...config, ...temp } : config;
    };
  });
};

const filterField: (keyof APIConfig)[] = [
  'web',
  'wechat',
  'dingtalk',
  'taobao',
  'alipay',
  'bytedance',
  'other',
  'dataType',
  'queryType',
];

export function filterConfig(config: APIConfig): FilterBaseAPIConfig {
  filterField.forEach((key) => {
    delete config[key];
  });
  if (config.method === 'GET') {
    delete config.defaultData;
  } else {
    delete config.defaultQuery;
  }
  return config;
}
