import type { TAllType } from '$/types/base';
import { onceFunc } from '../func-handler';
import { isAndroid, isIOS, isNode, isOpenHarmony } from '../ua';

/**
 * 生成随机字符串
 */
export function getRandomString(len = 8): string {
  let result = '';
  for (let curLen = 0; curLen < len; curLen = result.length) {
    const str = Math.random()
      .toString(36)
      .slice(2, len + 2);
    result += str.slice(0, len - curLen);
  }
  return result;
}

/**
 * 生成 blob 链接
 */
export function createLinkByString(resource: BlobPart) {
  const blob = new Blob([resource]);
  const url = URL.createObjectURL(blob);
  return url;
}

type GCArgs =
  | string
  | (undefined | null | string | Record<string, boolean>)[]
  | Record<string, boolean>
  | undefined
  | null;

/**
 * 生成 class 字符串
 */
export function generateClassName(...args: GCArgs[]) {
  if (!args.length)
    return '';
  const className: string = args
    .map((arg) => {
      if (typeof arg === 'string') {
        return arg;
      }
      else if (Array.isArray(arg)) {
        return generateClassName(...arg);
      }
      else if (typeof arg === 'object' && arg !== null) {
        return Object.keys(arg)
          .filter(key => arg[key])
          .join(' ');
      }
      else {
        return '';
      }
    })
    .join(' ')
    .replace(/\s+/g, ' ');
  return className.trimEnd();
}

/**
 * 生成 class 字符串
 *
 * @alias generateClassName
 */
export const gc = generateClassName;

/**
 * 获取操作系统类型
 */
export const getOsType = onceFunc(() => {
  if (isIOS())
    return 'ios';
  if (isAndroid())
    return 'android';
  if (isOpenHarmony())
    return 'openHarmony';
  if (isNode()) {
    // eslint-disable-next-line node/prefer-global/process
    const platform = process.platform;
    if (platform === 'darwin')
      return 'mac';
    if (platform === 'win32')
      return 'windows';
    if (platform === 'linux')
      return 'linux';
    return platform;
  }
  return 'other';
});

/**
 * 获取真实类型
 */
export function getType(value: any): TAllType {
  const baseType = typeof value;
  if (baseType !== 'object' && baseType !== 'function')
    return baseType;
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase() as TAllType;
}

/**
 * 获取 userAgent
 */
export const getUserAgent = onceFunc((): string => {
  if (globalThis.navigator) {
    // @ts-expect-error env
    return globalThis.navigator.userAgent || globalThis.navigator.swuserAgent;
  }
  // eslint-disable-next-line node/prefer-global/process
  else if (process) {
  // eslint-disable-next-line node/prefer-global/process
    return `Node.js/${process.version} (${process.platform}; ${process.arch}) ${process.env.SHELL} ${process.env.LANG} ${process.env.TERM_PROGRAM}`;
  }
  return '';
});

/**
 * 获取空格
 */
export function getSpace(length = 1) {
  return Array.from({ length }, () => ' ').join('');
}

/**
 * 获取字符
 */
export function getChar(char: string, length = 1) {
  return Array.from({ length }, () => char).join('');
}
