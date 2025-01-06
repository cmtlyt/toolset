import { warning } from '$/common/warning';
import { isWeb } from '../ua';

/**
 * 判断是否支持某个 css 特性
 */
export function caniuseCSSFeature(feature: string): boolean {
  if (!isWeb()) {
    warning('caniuse 只能在浏览器环境中使用');
    return false;
  }
  if (typeof window === 'undefined')
    return false;
  return window?.CSS?.supports?.(feature) || false;
}

/**
 * 判断是否支持某个 js 特性
 */
export function caniuse(feature: keyof typeof window): boolean {
  if (!isWeb()) {
    warning('caniuse 只能在浏览器环境中使用');
    return false;
  }
  if (typeof window === 'undefined')
    return false;
  return typeof window[feature] !== 'undefined';
}
