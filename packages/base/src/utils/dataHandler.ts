import { warning } from '@com/warning';

import { TObject } from '../types/base';

import { isNull } from './verify';
import { getType } from './getData';

type GetArray<T> = T extends any[] ? T : T[];

export function getArray<T>(value?: T): GetArray<T> {
  if (isNull(value)) return [] as any;
  return Array.isArray(value) ? value : ([value] as any);
}

export function getArraySlice<T>(array: T[], size = 0, skip = 0): T[][] {
  if (size <= 0) return [array];
  return array.slice(skip).reduce((acc, cur, index) => {
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
      let current = target[key] ?? item;
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

function _replaceOne(str: string, pattern: string | RegExp, replacer: (...args: string[]) => string | Promise<string>) {
  return new Promise<string>((resolve, reject) => {
    pattern = new RegExp(pattern);
    const match = str.match(pattern);
    if (!match) {
      resolve(str);
      return;
    }
    (async () => {
      try {
        const repStr = await replacer.apply(null, Array.from(match)).catch(reject);
        resolve(str.replace(pattern, repStr));
      } catch (e) {
        reject(e);
      }
    })();
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
      let match: any;
      let lastIndex = 0;
      const proms = [];
      while ((match = pattern.exec(str)) !== null) {
        const prom = replacer.apply(null, Array.from(match));
        const preStr = str.slice(lastIndex, match.index);
        lastIndex = match.index + match[0].length;
        proms.push(preStr, prom);
      }
      const lastStr = str.slice(lastIndex);
      proms.push(lastStr);
      (async () => {
        const temp = await Promise.all(proms).catch(reject);
        if (!temp) return;
        resolve(temp.join(''));
      })();
    });
  }
  return str;
}

export async function asyncFilter<T>(
  arr: T[],
  predicate: (item: T, index: number) => Promise<boolean> | boolean,
): Promise<T[]> {
  if (!Array.isArray(arr)) throw new TypeError('arr 必须是数组');
  if (!predicate || typeof predicate !== 'function') return arr;
  return (await Promise.all(arr.map(async (item, idx) => ((await predicate(item, idx)) ? item : null)))).filter(
    Boolean,
  );
}
