import { INTERNAL_EMPTY } from '$/common/constant';
import { warning } from '$/common/warning';
import { getType } from '../get-data';
import { isInIframe } from '../ua';

/**
 * 判断是否为 null 或 undefined
 */
export function isNull(value: any): value is null {
  return typeof value === 'undefined' || (typeof value === 'object' && value === null);
}

/**
 * 判断是否为 NaN
 */
export function isNaN(value: any): value is typeof Number.NaN {
  // eslint-disable-next-line no-self-compare
  return typeof value === 'number' && value !== value;
}

/**
 * 判断是否为数字
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

/**
 * 判断是否为 http 链接
 */
export function isHttpUrlString(value: any): boolean {
  return typeof value === 'string' && (/^http:\/\//.test(value) || /^\/\//.test(value));
}

/**
 * 判断是否为 https 链接
 */
export function isHttpsUrlString(value: any): boolean {
  return (typeof value === 'string' && /^https:\/\//.test(value)) || /^\/\//.test(value);
}

/**
 * 判断是否为 blob 链接
 */
export function isBlobUrlString(value: any): boolean {
  return typeof value === 'string' && value.startsWith('blob:');
}

/**
 * 判断是否为 data 链接
 */
export function isDataUrlString(value: any): boolean {
  return typeof value === 'string' && value.startsWith('data:');
}

/**
 * 判断是否为 url
 */
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

/**
 * 判断是否为 true 或字符串 true
 */
export function isTrue(value: any): value is true {
  return value === true || String(value).toLowerCase() === 'true';
}

/**
 * 判断是否为 false 或字符串 false
 */
export function isFalse(value: any): value is false {
  return value === false || String(value).toLowerCase() === 'false';
}

/**
 * 判断是否为空值 (通常用于 io 数据的判断)
 *
 * @warning 对于对象来说, 调用的是 Object.keys 获取长度, 所以只判断可枚举属性
 */
export function isEmpty(value: any): boolean {
  if (value === INTERNAL_EMPTY)
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

/**
 * 判断是否为字符串
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * 判断是否为 undefined 或字符串 undefined
 */
export function isUndef(value: any): value is undefined {
  return value === 'undefined' || typeof value === 'undefined';
}
