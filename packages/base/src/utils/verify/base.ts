import { EMPTY } from '$/common/constant';
import { warning } from '$/common/warning';
import { getType } from '../get-data';
import { isInIframe } from '../ua';

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

export function isEmpty(value: any): boolean {
  if (value === EMPTY)
    return true;
  if (typeof value === 'boolean')
    return false;
  if (typeof value === 'number')
    return Number.isNaN(value) || false;
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

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isUndef(value: any): value is undefined {
  return value === 'undefined' || typeof value === 'undefined';
}
