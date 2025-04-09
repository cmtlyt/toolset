import { onceFunc } from './func-handler';
import { getAliAppEnv, getDeviceInfo, getUserAgent } from './get-data';
import { isUndef } from './verify';

/** 判断是否为浏览器环境 */
export const isWeb = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return !ua.includes('node') && window && 'onload' in window;
});

/** 判断是否为 iframe 环境 */
export const isInIframe = onceFunc((): boolean => {
  if (!isWeb())
    return false;
  if (window?.frames?.length !== window?.parent?.frames?.length)
    return true;
  return false;
});

/** 判断是否为 node 环境 */
export const isNode = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('node');
});

/** 小程序环境 */
export const isMiniApp = onceFunc(() => {
  return typeof my !== 'undefined' && my !== null && typeof my.alert !== 'undefined';
});

/** 阿里小程序 */
export const isAliMiniApp = isMiniApp;

/** 字节小程序 */
export const isByteDanceMicroApp = onceFunc(() => {
  return typeof tt !== 'undefined' && tt !== null && typeof tt.showToast !== 'undefined';
});

/** 微信小程序 */
export const isWeChatMiniProgram = onceFunc(() => {
  return (
    !isWeb() && !isByteDanceMicroApp() && !isUndef(typeof wx) && (!isUndef(wx?.login) || !isUndef(wx?.miniProgram))
  );
});

/** weex 环境 */
export const isWeex = onceFunc(() => {
  return typeof WXEnvironment !== 'undefined' && WXEnvironment.platform !== 'Web';
});

/** ios */
export const isIOS = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('iphone') || ua.includes('ipad');
});

/** 安卓 */
export const isAndroid = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('android');
});

/** 鸿蒙 */
export const isOpenHarmony = onceFunc(() => {
  const ua = getUserAgent();
  return /\sOpenHarmony\s\d/i.test(ua);
});

/** chrome */
export const isChrome = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('chrome') || ua.includes('crios') || ua.includes('headlesschrome');
});

/** firefox */
export const isFirefox = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('firefox');
});

/** safari */
export const isSafari = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('safari') && !isChrome();
});

/** 新 edge */
export const isNewEdge = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('edg');
});

/** 旧 edge */
export const isOldEdge = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('edge') && !ua.includes('edg');
});

/** edge */
export const isEdge = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return ua.includes('edge');
});

/** kraken 环境 */
export const isKraken = onceFunc(() => {
  return typeof __kraken__ !== 'undefined';
});

/** 快应用 */
export const isQuickApp = onceFunc(() => {
  // @ts-expect-error any
  // eslint-disable-next-line no-restricted-globals
  return typeof global !== 'undefined' && global !== null && typeof global.callNative !== 'undefined' && !isWeex();
});

/** 淘宝 */
export const isTBWeb = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(TB/i.test(ua);
});

/** 淘特 */
export const isLTWeb = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(LT/i.test(ua);
});

/** 点淘 */
export const isTbLive = onceFunc(() => {
  const ua = getUserAgent();
  return (isWeb() || isNode()) && /AliApp\(TAOBAOLIVEAPP/i.test(ua);
});

/** 所有淘宝 web 环境 */
export const isTbWebEnv = onceFunc(() => {
  return isTBWeb() || (isWeb() && isTbLive());
});

/** 微信 */
export const isWechatWeb = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /MicroMessenger/i.test(ua);
});

/** 支付宝 */
export const isAliPayWeb = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(AP/i.test(ua);
});

/** 钉钉 */
export const isWebInDingding = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(DingTalk/i.test(ua);
});

/** 淘宝买菜团长端 */
export const isTuan = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(MMC/i.test(ua);
});

/** 零售通 */
export const isLST = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(RetailTrader/i.test(ua);
});

/** 零销宝 */
export const isLXB = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(RETAIL(?!Trader)/i.test(ua);
});

/** 阿里 app */
export const isAliAppWeb = onceFunc(() => {
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

/** 钉钉小程序 */
export const isDingdingMiniapp = onceFunc(() => {
  return !isUndef(typeof dd) && dd !== null && !isUndef(typeof dd.alert) && !isWeb();
});

/** 淘系小程序 */
export const isTaobaoMiniapp = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && TaobaoAppNames.includes(appName);
});

/** 支付宝 | 菜鸟小程序 */
export const isAlipayMiniapp = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && AlipayMiniAppNames.includes(appName);
});

/** 阿里小程序 */
export const isTBMiniapp = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && TBAppNames.includes(appName);
});

/** 淘特小程序 */
export const isLTMiniapp = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && LTAppNames.includes(appName);
});

/** 淘菜菜小程序 */
export const isMMCMiniapp = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && MMCAppNames.includes(appName);
});

/** 犀鸟小程序 */
export const isXiNiaoapp = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && XiNiaoAppNames.includes(appName);
});

/** 菜鸟小程序 */
export const isCaiNiaoApp = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && CaiNiaoAppNames.includes(appName);
});
/** 支付宝小程序 */
export const isAlipayApp = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return isAliMiniApp() && AlipayAppNames.includes(appName);
});

/** 百度小程序 */
export const isBaiduSmartProgram = onceFunc(() => {
  return typeof swan !== 'undefined' && swan !== null && typeof swan.showToast !== 'undefined';
});

/** 快手小程序 */
export const isKuaiShouMiniProgram = onceFunc(() => {
  return typeof ks !== 'undefined' && ks !== null && typeof ks.showToast !== 'undefined';
});

/** 小程序 */
export const isAliMiniappPlatform = onceFunc(() => {
  return isAliMiniApp() || isWeChatMiniProgram() || isByteDanceMicroApp();
});

/** 淘宝 */
export const isTBNode = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return isNode() && /AliApp\(TB/i.test(ua);
});

/** 淘特 */
export const isLTNode = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return isNode() && /AliApp\(LT/i.test(ua);
});

/** 微信 */
export const isWechatNode = onceFunc(() => {
  const ua = getUserAgent().toLocaleLowerCase();
  return isNode() && /MicroMessenger/i.test(ua);
});

/** 淘宝 */
export const isTB = onceFunc(() => {
  return isTBMiniapp() || isTBWeb() || isTBNode();
});

/** 淘特 */
export const isLT = onceFunc(() => {
  return isLTMiniapp() || isLTWeb() || isLTNode();
});

/** 支付宝 */
export const isAliPay = onceFunc(() => {
  return isAlipayMiniapp() || isAliPayWeb();
});

/** 天猫 */
export const isTmall = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return appName === 'tm';
});

/** 阿里app */
export const isAliApp = onceFunc(() => {
  return isTB() || isLT() || isAliPay() || isTbLive() || isTmall();
});

/** 微信端 */
export const isWechat = onceFunc(() => {
  return isWechatWeb() || isWeChatMiniProgram() || isWechatNode();
});

/** 菜鸟商业版本App，内嵌团长端小程序 */
export const isCaiNiaoBusiness = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(group_leader/i.test(ua);
});

/** 菜鸟商业版本App */
export const isCaiNiao = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && (/AliApp\(CN/i.test(ua) || /AliApp\(cainiao/i.test(ua));
});

/** 阿里系app */
export const isAliUa = onceFunc(() => {
  return isWeb() && /AliApp\(/.test(window.navigator.userAgent);
});

/** 盒马 */
export const isHmApp = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return appName === 'wdkhema';
});

/** 优酷 */
export const isYouKu = onceFunc(() => {
  const { appName } = getAliAppEnv();
  return appName === 'youku';
});

/** 支付宝 webview */
export const isAlipayMiniWeb = onceFunc(() => {
  return !!(isWeb() && window?.location?.search?.includes?.('__webview__=alipay'));
});

/** 淘特的 webview */
export const isLTMiniWeb = onceFunc(() => {
  return !!(isLTWeb() && window?.location?.search?.includes?.('__webview__=taobao'));
});

/** 【历史兼容】淘宝的 webview */
export const isLBMiniWeb = onceFunc(() => {
  return !!(isTBWeb() && window?.location?.search?.includes?.('__webview__=taobao'));
});

/** 淘宝的 webview */
export const isTBMiniWeb = onceFunc(() => {
  return isLBMiniWeb();
});

/** 钉钉 webview */
export const isDingTalk = onceFunc(() => {
  const ua = getUserAgent();
  return isWeb() && /AliApp\(DingTalk/i.test(ua);
});

/** 团长小程序 webview 嵌套的 h5 */
export const isTuanWebview = onceFunc(() => {
  return isWeb() && (isTuan() || isCaiNiaoBusiness() || window?.location?.search?.includes?.('__webview__=mmc'));
});

/** 微信小程序 webview */
export const isWechatMiniWeb = onceFunc(() => {
  const ua = getUserAgent();
  return isWechatWeb() && /miniProgram/i.test(ua);
});

/** 微信 h5 */
export const isWechatH5 = onceFunc(() => {
  return isWechatWeb() && !isWechatMiniWeb();
});

/** 小程序 webview */
export const isWebInMiniApp = onceFunc(() => {
  return isAlipayMiniWeb() || isWechatMiniWeb() || isLBMiniWeb() || isLTMiniWeb();
});

/** 阿里小程序 webview */
export const isAliWebInMiniApp = onceFunc(() => {
  return isAlipayMiniWeb() || isLBMiniWeb() || isLTMiniWeb();
});

/** 阿里应用小程序 */
export const isAliAppMiniApp = onceFunc(() => {
  return isTBMiniapp() || isLTMiniapp() || isAlipayMiniapp() || isMMCMiniapp();
});

/**
 * mini 系列 780
 *
 * iPhone X / iPhone XS / iphone 11 pro 812
 *
 * iphone 11, 11 pro max 896
 *
 * iphone 12, 13, 14 844
 *
 * iphone 12, 13, 14 plus 926
 *
 * iphone 14 pro 852
 *
 * iphone 14 pro max 932
 *
 * 如果要判断是否为「刘海屏」，建议使用 `isIOSNotchScreen`
 */
export const isIPhoneX = onceFunc(() => {
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
export const isIPhoneXSMax = onceFunc(() => {
  const { screenHeight, devicePixelRatio } = getDeviceInfo();
  return isIOS() && screenHeight === 896 && devicePixelRatio === 3;
});

/**
 * 是否 iPhone XR （1792 x 828）
 */
export const isIPhoneXR = onceFunc(() => {
  const { screenHeight, devicePixelRatio } = getDeviceInfo();
  return isIOS() && screenHeight === 896 && devicePixelRatio === 2;
});

/**
 * 是否 iPhone14 pro max
 */
export const isIPhone14PM = onceFunc(() => {
  const { screenHeight } = getDeviceInfo();
  return isIOS() && screenHeight === 932;
});

/**
 * 是否为 iOS 的「刘海屏」，用于针对顶部状态栏做特殊处理
 *
 * 目前 iOS 所有的「刘海屏」的适配方案是一样的
 */
export const isIOSNotchScreen = onceFunc(() => {
  return isIPhoneX() || isIPhoneXSMax() || isIPhoneXR() || isIPhone14PM();
});
