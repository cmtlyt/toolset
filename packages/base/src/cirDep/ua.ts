import { cacheByReturn } from './funcHandler';
import { getUserAgent } from './getUserAgent';
import { isUndef } from './verify';

// web 环境
export const isWeb = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return !ua.includes('node') && window && 'onload' in window;
});

// node 环境
export const isNode = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('node');
});

export const isMiniApp = cacheByReturn(() => {
  return typeof my !== 'undefined' && my !== null && typeof my.alert !== 'undefined';
});

// 阿里小程序
export const isAliMiniApp = isMiniApp;

// 字节小程序
export const isByteDanceMicroApp = cacheByReturn(() => {
  return typeof tt !== 'undefined' && tt !== null && typeof tt.showToast !== 'undefined';
});

// 微信小程序
export const isWeChatMiniProgram = cacheByReturn(() => {
  return (
    !isWeb() && !isByteDanceMicroApp() && !isUndef(typeof wx) && (!isUndef(wx?.login) || !isUndef(wx?.miniProgram))
  );
});

// weex 环境
export const isWeex = cacheByReturn(() => {
  return typeof WXEnvironment !== 'undefined' && WXEnvironment.platform !== 'Web';
});

// ios
export const isIOS = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('iphone') || ua.includes('ipad');
});

// 安卓
export const isAndroid = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('android');
});

export const isOpenHarmony = cacheByReturn(() => {
  const ua = getUserAgent();
  return /\sOpenHarmony\s\d/i.test(ua);
});
