import { warning } from '@com/warning';

import { getType, isEmpty, isNull } from './verify';
import { cacheByReturn } from './funcHandler';

type GetArray<T> = T extends any[] ? T : T[];

export function getArray<T>(value: T): GetArray<T> {
  if (isNull(value)) return [] as any;
  return Array.isArray(value) ? value : ([value] as any);
}

export function getArraySlice<T>(array: T[], size = 0): T[][] {
  if (size <= 0) return [array];
  return array.reduce((acc, cur, index) => {
    if (index % size === 0) {
      acc.push([]);
    }
    acc[acc.length - 1].push(cur);
    return acc;
  }, []);
}

export function deepClone<T extends TObject<any>>(obj: T, hash = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj);

  const newObj: TObject<any> = Array.isArray(obj) ? [] : {};
  hash.set(obj, newObj);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key], hash);
    }
  }
  return newObj as any;
}

function _merge(target: any, source: any) {
  if (getType(target) !== getType(source)) {
    warning('传入的两个参数类型不同,无法合并');
    return target;
  }
  if (typeof target === 'string' || typeof target === 'number') return target + source;
  if (Array.isArray(target)) return target.concat(source);
  if (typeof target === 'object' && target !== null) {
    for (const key in source) {
      const item = source[key];
      let current = item;
      if (typeof item === 'object' && item !== null) {
        current = target[key] || Array.isArray(item) ? [] : {};
        current = _merge(current, item);
      }
      target[key] = current;
    }
  }
  return target;
}

export function merge(target: any, ...source: any[]) {
  return source.reduce((acc, cur) => _merge(acc, cur), target);
}

export function cloneMerge(target: any, ...source: any) {
  target = deepClone(target);
  return merge(target, ...source);
}

export function formatDate(date = new Date(), format?: string) {
  warning('未来会实现~');
  if (!format) return date.valueOf() + '';
  // todo format
  return date.toLocaleString();
}

export const getNow = cacheByReturn(() => {
  if (typeof performance !== 'undefined') {
    return () => performance.now();
  }
  return () => Date.now();
});

export function getRandomString(len = 8): string {
  const str = Math.random()
    .toString(32)
    .slice(2, len + 2);
  if (str.length === len) {
    return str;
  }
  return str + getRandomString(len - str.length);
}

export function createLinkByString(resource: BlobPart) {
  const blob = new Blob([resource]);
  const url = URL.createObjectURL(blob);
  return url;
}

export interface CookieOptions {
  duration?: number;
  expires?: string | Date;
  domain?: string;
  maxAge?: number;
  path?: string;
}

export function generateCookieInfo(options: CookieOptions = {}) {
  const { duration, expires, domain, maxAge, path } = options;
  let infoString = '';
  if (isEmpty(options)) return infoString;
  if (duration) {
    const date = new Date();
    date.setTime(date.getTime() + duration);
    infoString += `expires=${date.toUTCString()};`;
  } else if (expires) {
    if (typeof expires === 'string') {
      infoString += `expires=${expires};`;
    } else if (expires instanceof Date) {
      infoString += `expires=${expires.toUTCString()};`;
    } else {
      throw new TypeError('expires 必须是字符串或 Date (推荐使用Date)');
    }
  }
  if (domain) {
    infoString += `domain=${domain};`;
  }
  if (maxAge) {
    infoString += `max-age=${maxAge};`;
  }
  if (path) {
    infoString += `path=${path};`;
  }
  return infoString;
}
export function generateClassName(...args: (string | string[] | Record<string, boolean> | undefined | null)[]) {
  if (!args.length) return '';
  const className = args
    .map((arg) => {
      if (typeof arg === 'string') {
        return arg;
      } else if (Array.isArray(arg)) {
        return generateClassName(...arg);
      } else if (typeof arg === 'object' && arg !== null) {
        return Object.keys(arg)
          .filter((key) => arg[key])
          .join(' ');
      } else {
        return '';
      }
    })
    .join(' ')
    .replace(/\s+/g, ' ');
  return className;
}

/**
 * @alias generateClassName
 */
export const gc = generateClassName;

function _replaceOne(str: string, pattern: string | RegExp, replacer: (...args: string[]) => string | Promise<string>) {
  return new Promise<string>((resolve, reject) => {
    try {
      pattern = new RegExp(pattern);
      const match = str.match(pattern);
      if (!match) {
        resolve(str);
        return;
      }
      (async () => {
        const repStr = await replacer.apply(null, match);
        resolve(str.replace(pattern, repStr));
      })();
    } catch (e) {
      reject(e);
    }
  });
}

export async function asyncReplace(
  str: string,
  pattern: string | RegExp,
  replacer: ((matchString: string, ...args: string[]) => string | Promise<string>) | string,
) {
  if (typeof replacer === 'string') return str.replace(pattern, replacer);
  if (typeof replacer !== 'function') {
    throw new TypeError('replacer 必须是字符串或函数');
  }
  if (typeof pattern === 'string') {
    return _replaceOne(str, pattern, replacer);
  }
  if (pattern instanceof RegExp) {
    if (!pattern.global) {
      return _replaceOne(str, pattern, replacer);
    }
    return new Promise<string>((resolve, reject) => {
      try {
        let match: any;
        let lastIndex = 0;
        const proms = [];
        while ((match = pattern.exec(str)) !== null) {
          const prom = replacer.apply(null, Array.from(match));
          const midStr = str.slice(lastIndex, match.index);
          lastIndex = match.index + match[0].length;
          proms.push(prom, midStr);
        }
        const lastStr = str.slice(lastIndex);
        proms.push(lastStr);
        (async () => {
          const temp = await Promise.all(proms);
          resolve(temp.join(''));
        })();
      } catch (e) {
        reject(e);
      }
    });
  }
  throw new TypeError('pattern 必须是字符串或正则表达式');
}
