import { warning } from '$/common/warning';

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
 * 使用 base64StringToStream 代替, base64StringToStream 已兼容 chunk 方式
 *
 * TODO: 后续大版本迭代会移除该方法
 * @deprecated
 */
export const chunkBase64StringToStream = base64StringToStream;

export function base64StringToStream(source: string) {
  const blob = base64StringToBlob(source);
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
