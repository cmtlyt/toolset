import type { TObject } from '$/types/base';
import { warning } from '$/common/warning';
import { iife, tryCall } from '../func-handler';
import { getChar, getType, safeGetGlobal } from '../get-data';
import { isNode, isWeb } from '../ua';
import { caniuse, isHttpsUrlString, isHttpUrlString } from '../verify';
import { fromEntries, objectForEach } from './object';

/**
 * stream 转 string
 */
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

/**
 * stream 转 arrayBuffer
 */
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

/**
 * arrayBuffer 转 base64
 */
export function arrayBufferToBase64String(arrayBuffer: ArrayBufferLike) {
  const chars = new Uint8Array(arrayBuffer).reduce((result, cur) => {
    return result + String.fromCharCode(cur);
  }, '');
  return btoa(chars);
}

/**
 * arrayBuffer 转 base64
 *
 * 使用 arrayBufferToBase64String 代替, arrayBufferToBase64String 已兼容 chunk 方式
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const arrayBufferToChunkBase64String = arrayBufferToBase64String;

/**
 * base64 转 Uint8Array
 */
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
 * base64 转 blob
 *
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

/**
 * base64 转 blob
 */
export function base64StringToBlob(base64String: string) {
  // TODO: 大版本升级将移除
  if (base64String.includes('|'))
    return chunkBase64StringToBlob(base64String);
  return new Blob([base64StringToUint8Array(base64String)]);
}

/**
 * base64 转 arrayBuffer
 *
 * 使用 base64StringToArrayBuffer 代替, base64StringToArrayBuffer 已兼容 chunk 方式
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const chunkBase64StringToArrayBuffer = base64StringToArrayBuffer;

/**
 * base64 转 arrayBuffer
 */
export async function base64StringToArrayBuffer(base64String: string) {
  const blob = base64StringToBlob(base64String);
  return blob.arrayBuffer();
}

/**
 * string 转只读 stream
 */
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

/**
 * string 转 Uint8Array
 */
export function stringToBinary(source: string) {
  const encoder = new TextEncoder();
  return encoder.encode(source);
}

/**
 * arrayBuffer 转 string
 */
export function binaryToString(binary: AllowSharedBufferSource) {
  const decoder = new TextDecoder();
  return decoder.decode(binary);
}

/**
 * stream 转 base64
 */
export async function streamToBase64String(stream: ReadableStream) {
  const arrayBuffer = await streamToArrayBuffer(stream);
  return arrayBufferToBase64String(arrayBuffer);
}

/**
 * stream 转 base64
 *
 * 使用 streamToBase64String 代替
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const streamToChunkBase64String = streamToBase64String;

/**
 * base64 转 stream
 *
 * 使用 base64StringToStream 代替, base64StringToStream 已兼容 chunk 方式
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const chunkBase64StringToStream = base64StringToStream;

/**
 * base64 转 stream
 */
export function base64StringToStream(source: string) {
  const blob = base64StringToBlob(source);
  return blob.stream();
}

/**
 * arrayBuffer 转 stream
 */
export function arrayBufferToStream(source: AllowSharedBufferSource | ArrayBufferLike) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(source);
      controller.close();
    },
  });
  return stream;
}

/**
 * blob 转 base64
 *
 * 使用 blobToBase64String 代替
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const blobToChunkBase64String = blobToBase64String;

/**
 * blob 转 base64
 */
export async function blobToBase64String(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return arrayBufferToBase64String(arrayBuffer);
}

interface ParseUrlOptions {
  hashQueryToSearchParams?: boolean;
}

/**
 * 解析 url
 */
export function parseUrl(path?: string, options?: ParseUrlOptions) {
  if (!path && !safeGetGlobal().location) {
    throw new TypeError('当前环境不存在 location, 无法使用默认值, 请传递 path 参数');
  }
  if ((isWeb() && !caniuse('URL')) || (isNode() && !safeGetGlobal().URL)) {
    throw new TypeError('当前环境不支持 URL, 无法使用 parseUrl 方法');
  }
  const { hashQueryToSearchParams } = options || {};
  let _path = path ||= safeGetGlobal().location.href;
  if (hashQueryToSearchParams && (isHttpUrlString(_path) || isHttpsUrlString(_path))) {
    const [tempPath, tempHash] = _path.split('#');
    const [hash, hashQuery] = (tempHash || '').split('?');
    const [basePath, search] = tempPath.split('?');
    const finishedSearch = `${search || ''}${search
      ? hashQuery ? `&${hashQuery}` : ''
      : hashQuery || ''}`;
    _path = `${basePath}${finishedSearch ? `?${finishedSearch}` : ''}${hash ? `#${hash}` : ''}`;
  }
  return new URL(_path);
}

export function parseSearch(search: string) {
  if ((isWeb() && !caniuse('URLSearchParams')) || (isNode() && !safeGetGlobal().URLSearchParams)) {
    throw new TypeError('当前环境不支持 URL, 无法使用 parseSearch 方法');
  }
  return new URLSearchParams(search);
}

export function parseSearchObject(search: string | URLSearchParams) {
  if (typeof search === 'string') {
    return tryCall(() => {
      return fromEntries(parseSearch(search).entries());
    }, () => {
      return fromEntries(search.replace(/^\?/, '').split('&').map(item => item.split('=')) as any);
    });
  }
  return fromEntries(search.entries());
}

interface ObjectToStringOptions {
  /**
   * 是否使用单引号
   *
   * @default false
   */
  singleQuotes?: boolean;
  /**
   * 是否换行
   *
   * @default false
   */
  wrap?: boolean;
  /** 缩进使用字符, 默认空格 */
  indentChar?: string;
  /**
   * 缩进数量, 默认 2
   *
   * 如果 wrap 为 true, 则该值生效
   */
  indent?: number;
}

export function toString(value: any, options?: Pick<ObjectToStringOptions, 'singleQuotes'>) {
  const { singleQuotes = false } = options || {};

  const _type = typeof value;

  switch (_type) {
    case 'string':
      return singleQuotes ? `'${value}'` : `"${value}"`;
    case 'number':
    case 'boolean':
    case 'bigint':
      return value.toString();
    case 'symbol':
      return value.toString().replace(/^Symbol\((.*)\)$/, `Symbol(${singleQuotes ? `'$1'` : `"$1"`})`);
    case 'function': {
      const funcStr: string = value.toString();
      return funcStr.startsWith('(') || funcStr.startsWith('function ') ? funcStr : `function ${funcStr}`;
    }
    case 'object':
      return objectToString(value, options);
    default:
      return JSON.stringify(value);
  }
}

export function objectToString(obj: TObject<any>, options?: ObjectToStringOptions): string {
  const _type = getType(obj);
  if (_type === 'regexp')
    return obj.toString();
  if (_type === 'null')
    return 'null';
  if (_type === 'date') {
    return `new Date(${obj.getTime()})`;
  }
  const { wrap = false, indentChar = ' ', indent = wrap ? 2 : 0 } = options || {};
  const indentStr = getChar(indentChar, indent);
  const objIsArray = Array.isArray(obj);
  const stringified: string[] = [];
  objectForEach(obj, (value, key) => {
    const result = iife(() => {
      if (objIsArray) {
        return `${wrap ? indentStr : ''}${toString(value, options)}`;
      }
      if (typeof value === 'object') {
        return `${wrap ? indentStr : ''}${key}: ${objectToString(value, { ...options, indent: indent + 2 })}`;
      }
      return `${wrap ? indentStr : ''}${key}: ${toString(value, options)}`;
    });
    stringified.push(result);
  });
  if (objIsArray) {
    return `[${wrap ? `\n` : ''}${stringified.join(wrap ? `,\n` : ', ')}${wrap ? `\n` : ''}]`;
  }
  return `{${wrap ? `\n` : ''}${stringified.join(wrap ? `,\n` : ', ')}${wrap ? `\n` : ''}}`;
}
