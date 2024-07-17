import { EMPTY } from '../common/constant';
import { warning } from '../common/warning';
import { cacheByReturn, getType, isWeb } from '../cirDep';

export function isNull(value: any): boolean {
  return typeof value === 'undefined' || (typeof value === 'object' && value === null);
}

export function isNaN(value: any): boolean {
  return typeof value === 'number' && value !== value;
}

export function isNumber(value: any): boolean {
  return typeof value === 'number';
}

export function isPromise(value: any): boolean {
  return (value || false) && typeof value.then === 'function';
}

export function isEmpty(value: any): boolean {
  if (value === EMPTY) return true;
  if (typeof value === 'boolean') return false;
  if (typeof value === 'number') return isNaN(value) || false;
  if (typeof value === 'object' && value !== null) {
    const type = getType(value);
    if (['set', 'map'].includes(type)) return value.size === 0;
    if (['weakmap', 'weakset'].includes(type)) return value.size === 0;
    return Object.keys(value).length === 0;
  }
  return isNull(value) || !value;
}

export const isFile = cacheByReturn(() => {
  if (isInIframe()) {
    warning('iframe 中无法正确判断!!!');
    return false;
  }
  if (!File) return false;
  if (File.prototype.isPrototypeOf) {
    return (value: any): boolean => File.prototype.isPrototypeOf(value);
  }
  return (value: any): boolean => value instanceof File;
});

export const isBlob = cacheByReturn(() => {
  if (isInIframe()) {
    warning('iframe 中无法正确判断!!!');
    return false;
  }
  if (!Blob) return false;
  if (Blob.prototype.isPrototypeOf) {
    return (value: any): boolean => Blob.prototype.isPrototypeOf(value);
  }
  return (value: any): boolean => value instanceof Blob;
});

export function isHttpUrlString(value: any): boolean {
  return typeof value === 'string' && (/^http?:\/\//.test(value) || /^\/\//.test(value));
}

export function isHttpsUrlString(value: any): boolean {
  return (typeof value === 'string' && /^https:\/\//.test(value)) || /^\/\//.test(value);
}

export function isBlobUrlString(value: any): boolean {
  return typeof value === 'string' && /^blob:/.test(value);
}

export function isDataUrlString(value: any): boolean {
  return typeof value === 'string' && /^data:/.test(value);
}

export function isUrl(value: any): boolean {
  if (isInIframe()) {
    warning('iframe 中无法正确判断!!!');
    return false;
  }
  return (
    value instanceof URL ||
    isHttpUrlString(value) ||
    isHttpsUrlString(value) ||
    isBlobUrlString(value) ||
    isDataUrlString(value)
  );
}

export function isTrue(value: any): boolean {
  return value === true || String(value).toLowerCase() === 'true';
}

export function isFalse(value: any): boolean {
  return value === false || String(value).toLowerCase() === 'false';
}

export function isAsyncFunc(value: any): boolean {
  warning('该方法存在生产环境和开发环境结果不一致风险, 请谨慎使用, 例如使用 babel 转换后 async 函数会变成普通函数');
  return getType(value) === 'asyncfunction';
}

export function isInIframe(): boolean {
  if (!isWeb()) return false;
  if (window?.frames?.length !== window?.parent?.frames?.length) return true;
  return false;
}

export function caniuseCSSFeature(feature: string): boolean {
  if (!isWeb()) {
    warning('caniuse 只能在浏览器环境中使用');
    return false;
  }
  if (typeof window === 'undefined') return false;
  return window?.CSS?.supports?.(feature) || false;
}

export function caniuse(feature: keyof typeof window): boolean {
  if (!isWeb()) {
    warning('caniuse 只能在浏览器环境中使用');
    return false;
  }
  if (typeof window === 'undefined') return false;
  return typeof window[feature] !== 'undefined';
}
