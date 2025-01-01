import { warning } from '$/common/warning';
import { isWeb } from '../ua';

export function caniuseCSSFeature(feature: string): boolean {
  if (!isWeb()) {
    warning('caniuse 只能在浏览器环境中使用');
    return false;
  }
  if (typeof window === 'undefined')
    return false;
  return window?.CSS?.supports?.(feature) || false;
}

export function caniuse(feature: keyof typeof window): boolean {
  if (!isWeb()) {
    warning('caniuse 只能在浏览器环境中使用');
    return false;
  }
  if (typeof window === 'undefined')
    return false;
  return typeof window[feature] !== 'undefined';
}
