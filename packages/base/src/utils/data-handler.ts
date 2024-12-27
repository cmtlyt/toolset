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
  if (arrayBuffer.byteLength >= 65556)
    warning('buffer size too large, use arrayBufferToChunkBase64String');
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}

export function base64StringToUint8Array(base64String: string) {
  if (base64String.length >= 65556)
    warning('base64 size too large, use chunkBase64StringToArrayBuffer');
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// TODO 不使用 chunk 方式转换
export function arrayBufferToChunkBase64String(arrayBuffer: ArrayBuffer) {
  const chunkSize = 1024 * 10;
  const base64Chunks = [];
  let currArrayBuffer = arrayBuffer.slice(base64Chunks.length * chunkSize, base64Chunks.length * chunkSize + chunkSize);
  while (currArrayBuffer.byteLength > 0) {
    base64Chunks.push(arrayBufferToBase64String(currArrayBuffer));
    currArrayBuffer = arrayBuffer.slice(base64Chunks.length * chunkSize, base64Chunks.length * chunkSize + chunkSize);
  }
  return base64Chunks.join('|');
}

// TODO 不使用 chunk 方式转换
export function chunkBase64StringToBlob(base64String: string) {
  const chunks = base64String.split('|');
  return new Blob(chunks.map(chunk => base64StringToUint8Array(chunk)));
}

// TODO 不使用 chunk 方式转换
export async function chunkBase64StringToArrayBuffer(base64String: string) {
  const blob = chunkBase64StringToBlob(base64String);
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

// TODO 不使用 chunk 方式转换
export async function streamToChunkBase64String(stream: ReadableStream) {
  const arrayBuffer = await streamToArrayBuffer(stream);
  return arrayBufferToChunkBase64String(arrayBuffer);
}

// TODO 不使用 chunk 方式转换
export async function chunkBase64StringToStream(base64: string) {
  const blob = chunkBase64StringToBlob(base64);
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

// TODO 不使用 chunk 方式转换
export async function blobToChunkBase64String(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return arrayBufferToChunkBase64String(arrayBuffer);
}

export const filter = curry(<T>(handle: (item: T, index: number) => boolean, arr: T[]) => {
  return arr.filter((item, index) => handle(item, index));
});

export const map = curry(<T, R>(handle: (item: T, index: number) => R, arr: T[]): R[] => {
  return arr.map((item, index) => handle(item, index));
});

export const reduce = curry(<T, R>(handle: (acc: R, item: T, index: number) => R, init: R, arr: T[]) => {
  return arr.reduce((acc, item, index) => handle(acc, item, index), init);
});

export const every = curry(<T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean => {
  return arr.every((item, index) => handle(item, index));
});

export const some = curry(<T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean => {
  return arr.some((item, index) => handle(item, index));
});

export const find = curry(<T>(handle: (item: T, index: number) => boolean, arr: T[]): T | undefined => {
  return arr.find((item, index) => handle(item, index));
});

export const findIndex = curry(<T>(handle: (item: T, index: number) => boolean, arr: T[]): number => {
  return arr.findIndex((item, index) => handle(item, index));
});

export const includes = curry((item: any, arr: any[]) => {
  return arr.includes(item);
});

export const join = curry((separator: string, arr: any[]) => {
  return arr.join(separator);
});
