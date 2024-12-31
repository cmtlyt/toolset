import type { TObject } from '../types/base';
import { curry, getType } from '../cir-dep';
import { STATIC_TYPE } from '../common/constant';
import { warning } from '../common/warning';
import { isNull } from './verify';

type GetArray<T> = T extends any[] ? T : T[];

export function getArray<T>(value?: T): GetArray<T> {
  if (isNull(value))
    return [] as any;
  return Array.isArray(value) ? (value as any) : ([value] as any);
}

export function getArraySlice<T>(array: T[], size = 0, skip = 0): T[][] {
  if (size <= 0)
    return [array];
  return array.slice(skip).reduce<T[][]>((acc, cur, index) => {
    if (index % size === 0) {
      acc.push([]);
    }
    acc[acc.length - 1].push(cur);
    return acc;
  }, []);
}

export function deepClone<T extends TObject<any>>(obj: T, hash = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object' || STATIC_TYPE.includes(getType(obj)))
    return obj;
  if (hash.has(obj))
    return hash.get(obj);

  const newObj: TObject<any> = Array.isArray(obj) ? [] : {};
  hash.set(obj, newObj);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepClone(obj[key], hash);
    }
  }
  return newObj as any;
}

function _merge(target: any, source: any) {
  const targetType = getType(target);
  if (STATIC_TYPE.includes(targetType))
    return target;
  if (targetType !== getType(source)) {
    if (STATIC_TYPE.includes(getType(source)))
      return source;
    warning('传入的两个参数类型不同,无法合并');
    return target;
  }
  if (targetType === 'string' || targetType === 'number')
    return target + source;
  if (Array.isArray(target))
    return target.concat(source);
  if (targetType === 'object') {
    for (const key in source) {
      const item = source[key];
      let current = target[key] ?? item;
      if (!STATIC_TYPE.includes(getType(current)) && typeof item === 'object' && item !== null) {
        current = target[key] || (Array.isArray(item) ? [] : {});
        current = _merge(current, item);
      }
      target[key] = current;
    }
  }
  return target || source;
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
  if (!format)
    return `${date.valueOf()}`;
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
        const repStr = (await (replacer(...Array.from(match)) as Promise<string>).catch(reject))!;
        resolve(str.replace(pattern, repStr));
      }
      catch (e) {
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
  if (typeof replacer === 'string')
    return str.replace(pattern, replacer);
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
      match = pattern.exec(str);
      while (match !== null) {
        // @ts-expect-error 通过 Array.from 直接转换 match
        const prom = replacer(...Array.from(match));
        const preStr = str.slice(lastIndex, match.index);
        lastIndex = match.index + match[0].length;
        proms.push(preStr, prom);
        match = pattern.exec(str);
      }
      const lastStr = str.slice(lastIndex);
      proms.push(lastStr);
      (async () => {
        const temp = await Promise.all(proms).catch(reject);
        if (!temp)
          return;
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
  if (!Array.isArray(arr))
    throw new TypeError('arr 必须是数组');
  if (!predicate || typeof predicate !== 'function')
    return arr;
  return (await Promise.all(arr.map(async (item, idx) => ((await predicate(item, idx)) ? item : null)))).filter(
    Boolean,
  ) as T[];
}

export async function streamToString(stream: ReadableStream) {
  const reader = stream.getReader();
  const chunks = [];
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }

  const decoder = new TextDecoder('utf-8');
  for (const chunk of chunks) {
    result += decoder.decode(chunk);
  }
  result += decoder.decode();

  return result;
}

export async function streamToArrayBuffer(stream: ReadableStream) {
  const reader = stream.getReader();
  const chunks = [];
  let totalSize = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    totalSize += value.byteLength;
  }

  const arrayBuffer = new ArrayBuffer(totalSize);
  let offset = 0;
  for (const chunk of chunks) {
    const chunkArray = new Uint8Array(chunk);
    const destArray = new Uint8Array(arrayBuffer, offset, chunkArray.length);
    destArray.set(chunkArray);
    offset += chunkArray.length;
  }

  return arrayBuffer;
}

export function arrayBufferToBase64String(arrayBuffer: ArrayBuffer) {
  const chars = new Uint8Array(arrayBuffer).reduce((result, cur) => {
    return result + String.fromCharCode(cur);
  }, '');
  return btoa(chars);
}

/**
 * 使用 arrayBufferToBase64String 代替, arrayBufferToBase64String 已兼容 chunk 方式
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const arrayBufferToChunkBase64String = arrayBufferToBase64String;

export function base64StringToUint8Array(base64String: string) {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * 使用 base64StringToBlob 代替, base64StringToBlob 已兼容 chunk 方式
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export function chunkBase64StringToBlob(base64String: string) {
  warning('当前字符串使用 chunk 方式生成, 请使用 base64StringToBlob 代替, 后续 chunkBase64StringToBlob 方法将会移除');
  const chunks = base64String.split('|');
  return new Blob(chunks.map(chunk => base64StringToUint8Array(chunk)));
}

export function base64StringToBlob(base64String: string) {
  // TODO: 大版本升级将移除
  if (base64String.includes('|'))
    return chunkBase64StringToBlob(base64String);
  return new Blob([base64StringToUint8Array(base64String)]);
}

/**
 * 使用 base64StringToArrayBuffer 代替, base64StringToArrayBuffer 已兼容 chunk 方式
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const chunkBase64StringToArrayBuffer = base64StringToArrayBuffer;

export async function base64StringToArrayBuffer(base64String: string) {
  const blob = base64StringToBlob(base64String);
  return blob.arrayBuffer();
}

export function stringToStream(source: string) {
  const encoder = new TextEncoder();
  const stringStream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(source));
      controller.close();
    },
  });
  return stringStream;
}

export function stringToBinary(source: string) {
  const encoder = new TextEncoder();
  return encoder.encode(source);
}

export function binaryToString(binary: AllowSharedBufferSource) {
  const decoder = new TextDecoder();
  return decoder.decode(binary);
}

export async function streamToBase64String(stream: ReadableStream) {
  const arrayBuffer = await streamToArrayBuffer(stream);
  return arrayBufferToBase64String(arrayBuffer);
}

/**
 * 使用 streamToBase64String 代替
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const streamToChunkBase64String = streamToBase64String;

/**
 * 使用 chunkBase64StringToBlob 代替, chunkBase64StringToBlob 已兼容 chunk 方式
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export async function chunkBase64StringToStream(base64: string) {
  const blob = base64StringToBlob(base64);
  return blob.stream();
}

export function arrayBufferToStream(source: AllowSharedBufferSource) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(source);
      controller.close();
    },
  });
  return stream;
}

export function base64StringToStream(source: string) {
  const uint8Array = base64StringToUint8Array(source);
  const stream = arrayBufferToStream(uint8Array);
  return stream;
}

/**
 * 使用 blobToBase64String 代替
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const blobToChunkBase64String = blobToBase64String;

export async function blobToBase64String(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return arrayBufferToBase64String(arrayBuffer);
}

export const filter = curry((handle: (item: any, index: number) => boolean, arr: any[]) => {
  return arr.filter((item, index) => handle(item, index));
});

export const map = curry((handle: (item: any, index: number) => any, arr: any[]): any[] => {
  return arr.map((item, index) => handle(item, index));
});

export const reduce = curry((handle: (acc: any, item: any, index: number) => any, init: any, arr: any[]) => {
  return arr.reduce((acc, item, index) => handle(acc, item, index), init);
});

export const every = curry((handle: (item: any, index: number) => boolean, arr: any[]): boolean => {
  return arr.every((item, index) => handle(item, index));
});

export const some = curry((handle: (item: any, index: number) => boolean, arr: any[]): boolean => {
  return arr.some((item, index) => handle(item, index));
});

export const find = curry((handle: (item: any, index: number) => boolean, arr: any[]): any | undefined => {
  return arr.find((item, index) => handle(item, index));
});

export const findIndex = curry((handle: (item: any, index: number) => boolean, arr: any[]): number => {
  return arr.findIndex((item, index) => handle(item, index));
});

export const includes = curry((item: any, arr: any[]) => {
  return arr.includes(item);
});

export const join = curry((separator: string, arr: any[]) => {
  return arr.join(separator);
});
