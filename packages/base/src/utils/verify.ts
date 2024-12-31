import { cacheByReturn, getType, isWeb } from '../cir-dep';
import { EMPTY } from '../common/constant';
import { warning } from '../common/warning';

export function isNull(value: any): value is null {
  return typeof value === 'undefined' || (typeof value === 'object' && value === null);
}

export function isNaN(value: any): value is typeof Number.NaN {
  // eslint-disable-next-line no-self-compare
  return typeof value === 'number' && value !== value;
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isPromise(value: any): value is Promise<any>;
export function isPromise<T>(value: Promise<T>): value is Promise<T>;
export function isPromise(value: any): value is Promise<any> {
  return (value || false) && typeof value.then === 'function';
}

export function isEmpty(value: any): boolean {
  if (value === EMPTY)
    return true;
  if (typeof value === 'boolean')
    return false;
  if (typeof value === 'number')
    return isNaN(value) || false;
  if (typeof value === 'object' && value !== null) {
    const type = getType(value);
    if (['set', 'map'].includes(type))
      return value.size === 0;
    if (['weakmap', 'weakset'].includes(type))
      return value.size === 0;
    return Object.keys(value).length === 0;
  }
  return isNull(value) || !value;
}

export const isFile = cacheByReturn(() => {
  if (isInIframe()) {
    warning('iframe 中无法正确判断!!!');
    return false;
  }
  if (!File)
    return false;
  if (File.prototype) {
    return (value: any): boolean => Object.prototype.isPrototypeOf.call(File.prototype, value);
  }
  return (value: any): boolean => value instanceof File;
});

export const isBlob = cacheByReturn(() => {
  if (isInIframe()) {
    warning('iframe 中无法正确判断!!!');
    return false;
  }
  if (!Blob)
    return false;
  if (Blob.prototype) {
    return (value: any): boolean => Object.prototype.isPrototypeOf.call(Blob.prototype, value);
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
  return typeof value === 'string' && value.startsWith('blob:');
}

export function isDataUrlString(value: any): boolean {
  return typeof value === 'string' && value.startsWith('data:');
}

export function isUrl(value: any): boolean {
  if (isInIframe()) {
    warning('iframe 中无法正确判断!!!');
    return false;
  }
  return (
    value instanceof URL
    || isHttpUrlString(value)
    || isHttpsUrlString(value)
    || isBlobUrlString(value)
    || isDataUrlString(value)
  );
}

export function isTrue(value: any): value is true {
  return value === true || String(value).toLowerCase() === 'true';
}

export function isFalse(value: any): value is false {
  return value === false || String(value).toLowerCase() === 'false';
}

export function isAsyncFunc(value: any): value is (...args: any[]) => Promise<any> {
  warning('该方法存在生产环境和开发环境结果不一致风险, 请谨慎使用, 例如使用 babel 转换后 async 函数会变成普通函数');
  return getType(value) === 'asyncfunction';
}

export function isInIframe(): boolean {
  if (!isWeb())
    return false;
  if (window?.frames?.length !== window?.parent?.frames?.length)
    return true;
  return false;
}

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

export function isConstructor(obj: any): boolean {
  if (!(obj instanceof Object))
    return false;
  if (typeof Object.getPrototypeOf(obj).constructor === 'function')
    return true;
  return false;
}

export function isArrayLike(data: any): boolean {
  if (Array.isArray(data))
    return true;
  if (data instanceof String)
    return true;
  if (data && typeof data === 'object' && typeof data.length === 'number')
    return true;
  return false;
}

export function isArray(value: any): value is Array<any>;
export function isArray<T>(value: T[]): value is T[];
export function isArray(value: any): value is Array<any> {
  return Array.isArray(value);
}
