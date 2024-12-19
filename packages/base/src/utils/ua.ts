import {
  cacheByReturn,
  getAliAppEnv,
  getDeviceInfo,
  getUserAgent,
  isAliMiniApp,
  isByteDanceMicroApp,
  isIOS,
  isNode,
  isUndef,
  isWeb,
  isWeChatMiniProgram,
  isWeex,
} from '../cirDep';

// chrome
export const isChrome = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('chrome') || ua.includes('crios') || ua.includes('headlesschrome');
});

// firefox
export const isFirefox = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('firefox');
});

// safari
export const isSafari = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('safari') && !isChrome();
});

// 新 edge
export const isNewEdge = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('edg');
});

// 旧 edge
export const isOldEdge = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('edge') && !ua.includes('edg');
});

// edge
export const isEdge = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('edge');
});

// kraken 环境
export const isKraken = cacheByReturn(() => {
  return typeof __kraken__ !== 'undefined';
});

// 快应用
export const isQuickApp = cacheByReturn(() => {
  // @ts-expect-error global
  // eslint-disable-next-line no-restricted-globals
  return typeof global !== 'undefined' && global !== null && typeof global.callNative !== 'undefined' && !isWeex();
});

// 淘宝
export const isTBWeb = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(TB/i.test(ua);
});

// 淘特
export const isLTWeb = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(LT/i.test(ua);
});

// 点淘
export const isTbLive = cacheByReturn(() => {
  const ua = getUserAgent();
  return (isWeb() || isNode()) && /AliApp\(TAOBAOLIVEAPP/i.test(ua);
});

// 所有淘宝web环境
export const isTbWebEnv = cacheByReturn(() => {
  return isTBWeb() || (isWeb() && isTbLive());
});

// 微信
export const isWechatWeb = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /MicroMessenger/i.test(ua);
});

// 支付宝
export const isAliPayWeb = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(AP/i.test(ua);
});

// 钉钉
export const isWebInDingding = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(DingTalk/i.test(ua);
});

// 淘宝买菜团长端
export const isTuan = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(MMC/i.test(ua);
});

// 零售通
export const isLST = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(RetailTrader/i.test(ua);
});

// 零销宝
export const isLXB = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(RETAIL(?!Trader)/i.test(ua);
});

// 阿里app
export const isAliAppWeb = cacheByReturn(() => {
  return isTBWeb() || isLTWeb() || isTbLive() || isAliPayWeb();
});

const TBAppNames = ['taobao', 'tb'];
const LTAppNames = ['lt'];
const MMCAppNames = ['mmc', 'hmjs-c'];
const XiNiaoAppNames = ['xiniao'];
const TaobaoAppNames = [...TBAppNames, ...LTAppNames, ...MMCAppNames, ...XiNiaoAppNames, 'cngl'];

const AlipayAppNames = ['alipay'];
const CaiNiaoAppNames = ['cn', 'cainiao', 'com.cainiao.wireless'];
const AlipayMiniAppNames = [...AlipayAppNames, ...CaiNiaoAppNames];

// 钉钉小程序
export const isDingdingMiniapp = cacheByReturn(() => {
  return !isUndef(typeof dd) && dd !== null && !isUndef(typeof dd.alert) && !isWeb();
});

// 淘系小程序
export const isTaobaoMiniapp = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && TaobaoAppNames.includes(appName);
});

// 支付宝 | 菜鸟小程序
export const isAlipayMiniapp = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && AlipayMiniAppNames.includes(appName);
});

// 阿里小程序
export const isTBMiniapp = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && TBAppNames.includes(appName);
});

// 淘特小程序
export const isLTMiniapp = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && LTAppNames.includes(appName);
});

// 淘菜菜小程序
export const isMMCMiniapp = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && MMCAppNames.includes(appName);
});

// 犀鸟小程序
export const isXiNiaoapp = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && XiNiaoAppNames.includes(appName);
});

// 菜鸟小程序
export const isCaiNiaoApp = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && CaiNiaoAppNames.includes(appName);
});
// 支付宝小程序
export const isAlipayApp = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && AlipayAppNames.includes(appName);
});

// 百度小程序
export const isBaiduSmartProgram = cacheByReturn(() => {
  return typeof swan !== 'undefined' && swan !== null && typeof swan.showToast !== 'undefined';
});

// 快手小程序
export const isKuaiShouMiniProgram = cacheByReturn(() => {
  return typeof ks !== 'undefined' && ks !== null && typeof ks.showToast !== 'undefined';
});

// 小程序
export const isAliMiniappPlatform = cacheByReturn(() => {
  return isAliMiniApp() || isWeChatMiniProgram() || isByteDanceMicroApp();
});

// 淘宝
export const isTBNode = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return isNode() && /AliApp\(TB/i.test(ua);
});

// 淘特
export const isLTNode = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return isNode() && /AliApp\(LT/i.test(ua);
});

// 微信
export const isWechatNode = cacheByReturn(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return isNode() && /MicroMessenger/i.test(ua);
});

// 淘宝
export const isTB = cacheByReturn(() => {
  return isTBMiniapp() || isTBWeb() || isTBNode();
});

// 淘特
export const isLT = cacheByReturn(() => {
  return isLTMiniapp() || isLTWeb() || isLTNode();
});

// 支付宝
export const isAliPay = cacheByReturn(() => {
  return isAlipayMiniapp() || isAliPayWeb();
});

// 天猫
export const isTmall = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return appName === 'tm';
});

// 阿里app
export const isAliApp = cacheByReturn(() => {
  return isTB() || isLT() || isAliPay() || isTbLive() || isTmall();
});

// 微信端
export const isWechat = cacheByReturn(() => {
  return isWechatWeb() || isWeChatMiniProgram() || isWechatNode();
});

// 菜鸟商业版本App，内嵌团长端小程序
export const isCaiNiaoBusiness = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(group_leader/i.test(ua);
});

// 菜鸟商业版本App
export const isCaiNiao = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && (/AliApp\(CN/i.test(ua) || /AliApp\(cainiao/i.test(ua));
});

// 阿里系app
export const isAliUa = cacheByReturn(() => {
  return isWeb() && /AliApp\(/.test(window.navigator.userAgent);
});

// 盒马
export const isHmApp = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return appName === 'wdkhema';
});

// 优酷
export const isYouKu = cacheByReturn(() => {
  const { appName } = getAliAppEnv();
  return appName === 'youku';
});

// 支付宝webview
export const isAlipayMiniWeb = cacheByReturn(() => {
  return !!(isWeb() && window?.location?.search?.includes?.('__webview__=alipay'));
});

// 淘特的webview
export const isLTMiniWeb = cacheByReturn(() => {
  return !!(isLTWeb() && window?.location?.search?.includes?.('__webview__=taobao'));
});

// 【历史兼容】淘宝的webview
export const isLBMiniWeb = cacheByReturn(() => {
  return !!(isTBWeb() && window?.location?.search?.includes?.('__webview__=taobao'));
});

// 淘宝的webview
export const isTBMiniWeb = cacheByReturn(() => {
  return isLBMiniWeb();
});

// 钉钉webview
export const isDingTalk = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(DingTalk/i.test(ua);
});

// 团长小程序webview嵌套的h5
export const isTuanWebview = cacheByReturn(() => {
  return isWeb() && (isTuan() || isCaiNiaoBusiness() || window?.location?.search?.includes?.('__webview__=mmc'));
});

// 微信小程序webview
export const isWechatMiniWeb = cacheByReturn(() => {
  const ua = getUserAgent();
  return isWechatWeb() && /miniProgram/i.test(ua);
});

// 微信h5
export const isWechatH5 = cacheByReturn(() => {
  return isWechatWeb() && !isWechatMiniWeb();
});

// 小程序webview
export const isWebInMiniApp = cacheByReturn(() => {
  return isAlipayMiniWeb() || isWechatMiniWeb() || isLBMiniWeb() || isLTMiniWeb();
});

// 阿里小程序webview
export const isAliWebInMiniApp = cacheByReturn(() => {
  return isAlipayMiniWeb() || isLBMiniWeb() || isLTMiniWeb();
});

// 阿里应用小程序
export const isAliAppMiniApp = cacheByReturn(() => {
  return isTBMiniapp() || isLTMiniapp() || isAlipayMiniapp() || isMMCMiniapp();
});

/**
 * mini 系列 780
 * iPhone X / iPhone XS / iphone 11 pro 812
 * iphone 11, 11 pro max 896
 * iphone 12, 13, 14 844
 * iphone 12, 13, 14 plus 926
 * iphone 14 pro 852
 * iphone 14 pro max 932
 * http://gitlab.alibaba-inc.com/universal/iphonex-helper/blob/master/src/index.js
 * 如果要判断是否为「刘海屏」，建议使用 `isIOSNotchScreen`
 */
export const isIPhoneX = cacheByReturn(() => {
  const { screenHeight } = getDeviceInfo();
  return (
    isIOS()
    && [812, 896, 844, 926, 693, 780, 932, 852].includes(
      isWeChatMiniProgram() ? (wx.getSystemInfoSync() || {}).screenHeight : screenHeight,
    )
  );
});

/**
 * 是否 iPhone XS Max （2688 x 1242）
 */
export const isIPhoneXSMax = cacheByReturn(() => {
  const { screenHeight, devicePixelRatio } = getDeviceInfo();
  return isIOS() && screenHeight === 896 && devicePixelRatio === 3;
});

/**
 * 是否 iPhone XR （1792 x 828）
 */
export const isIPhoneXR = cacheByReturn(() => {
  const { screenHeight, devicePixelRatio } = getDeviceInfo();
  return isIOS() && screenHeight === 896 && devicePixelRatio === 2;
});

/**
 * 是否 iPhone14 pro max
 */
export const isIPhone14PM = cacheByReturn(() => {
  const { screenHeight } = getDeviceInfo();
  return isIOS() && screenHeight === 932;
});

/**
 * 是否为 iOS 的「刘海屏」，用于针对顶部状态栏做特殊处理
 * 目前 iOS 所有的「刘海屏」的适配方案是一样的
 */
export const isIOSNotchScreen = cacheByReturn(() => {
  return isIPhoneX() || isIPhoneXSMax() || isIPhoneXR() || isIPhone14PM();
});
