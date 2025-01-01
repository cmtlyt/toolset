import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, inject, it } from 'vitest';

describe('data-handler', async () => {
  const { ...utils } = await (() => {
    return inject('CI') ? import('../dist') : import('../src/utils/data-handler');
  })() as typeof import('../src/utils/data-handler');

  const longString = readFileSync(resolve(import.meta.dirname, './long-str.txt'), 'utf-8');

  it('原文和 base64 相互转换', async () => {
    const blob = new Blob([longString]);
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = utils.arrayBufferToBase64String(arrayBuffer);
    expect(base64).toMatchFileSnapshot('./__snapshots__/long-string.base64.txt');
    const decodeBuffer = utils.base64StringToUint8Array(base64);
    expect(utils.arrayBufferToBase64String(decodeBuffer)).toEqual(base64);
  });

  it('arrayBufferToBase64String and base64StringToArrayBuffer', async () => {
    const arrayBuffer = new TextEncoder().encode('test string').buffer;
    const base64 = utils.arrayBufferToBase64String(arrayBuffer);
    const decodedArrayBuffer = await utils.base64StringToArrayBuffer(base64);
    expect(new Uint8Array(decodedArrayBuffer)).toEqual(new Uint8Array(arrayBuffer));
  });

  it('chunkBase64StringToBlob and base64StringToBlob', async () => {
    const base64 = utils.arrayBufferToBase64String(new TextEncoder().encode('test string').buffer);
    const chunkBase64 = `${base64}|`;
    const blob = utils.chunkBase64StringToBlob(chunkBase64);
    const base64FromBlob = await utils.blobToBase64String(blob);
    expect(base64FromBlob).toEqual(base64);
  });

  it('streamToBase64String and base64StringToStream', async () => {
    const stream = utils.stringToStream(longString);
    const base64 = await utils.streamToBase64String(stream);
    const resultStream = utils.base64StringToStream(base64);
    const resultString = await utils.streamToString(resultStream);
    expect(resultString).toEqual(longString);
  });

  it('asyncReplace', async () => {
    const result = await utils.asyncReplace('hello world', 'world', async () => 'vitest');
    expect(result).toEqual('hello vitest');
  });

  it('asyncReplace with non-global regex', async () => {
    const result = await utils.asyncReplace('hello world', /world/, async () => 'vitest');
    expect(result).toEqual('hello vitest');
  });

  it('asyncReplace with global regex', async () => {
    const result = await utils.asyncReplace('hello world world', /world/g, async () => 'vitest');
    expect(result).toEqual('hello vitest vitest');
  });

  it('asyncReplace with string replacer', async () => {
    const result = await utils.asyncReplace('hello world', 'world', 'vitest');
    expect(result).toEqual('hello vitest');
  });

  it('asyncFilter', async () => {
    const result = await utils.asyncFilter([1, 2, 3, 4], async item => item % 2 === 0);
    expect(result).toEqual([2, 4]);
  });

  it('deepClone', () => {
    const obj = { a: 1, b: { c: 2 } };
    const clonedObj = utils.deepClone(obj);
    expect(clonedObj).toEqual(obj);
    expect(clonedObj).not.toBe(obj);
  });

  it('merge', () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { b: { d: 3 }, e: 4 };
    const mergedObj = utils.merge(obj1, obj2);
    expect(mergedObj).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
  });

  it('merge with different types', () => {
    const obj1 = { a: 1, b: 'string' };
    const obj2 = { b: 2, c: [3, 4] };
    const mergedObj = utils.merge(obj1, obj2);
    expect(mergedObj).toEqual({ a: 1, b: 'string', c: [3, 4] });
  });

  it('merge with arrays', () => {
    const arr1 = [1, 2];
    const arr2 = [3, 4];
    const mergedArr = utils.merge(arr1, arr2);
    expect(mergedArr).toEqual([1, 2, 3, 4]);
  });

  it('merge with nested objects', () => {
    const obj1 = { a: { b: 1 } };
    const obj2 = { a: { c: 2 } };
    const mergedObj = utils.merge(obj1, obj2);
    expect(mergedObj).toEqual({ a: { b: 1, c: 2 } });
  });

  it('cloneMerge', () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { b: { d: 3 }, e: 4 };
    const mergedObj = utils.cloneMerge(obj1, obj2);
    expect(mergedObj).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    expect(mergedObj).not.toBe(obj1);
  });

  it('getArray', () => {
    expect(utils.getArray(1)).toEqual([1]);
    expect(utils.getArray([1, 2, 3])).toEqual([1, 2, 3]);
    expect(utils.getArray()).toEqual([]);
  });

  it('getArraySlice', () => {
    expect(utils.getArraySlice([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    expect(utils.getArraySlice([1, 2, 3, 4], 2, 1)).toEqual([[2, 3], [4]]);
    expect(utils.getArraySlice([1, 2, 3, 4], 0)).toEqual([[1, 2, 3, 4]]);
  });

  it('formatDate', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    expect(utils.formatDate(date)).toEqual('1672531200000');
  });

  it('stringToBinary and binaryToString', () => {
    const str = 'test string';
    const binary = utils.stringToBinary(str);
    const result = utils.binaryToString(binary);
    expect(result).toEqual(str);
  });

  it('arrayBufferToStream and streamToArrayBuffer', async () => {
    const arrayBuffer = new TextEncoder().encode('test string').buffer;
    const stream = utils.arrayBufferToStream(arrayBuffer);
    const resultArrayBuffer = await utils.streamToArrayBuffer(stream);
    expect(new Uint8Array(resultArrayBuffer)).toEqual(new Uint8Array(arrayBuffer));
  });

  it('chunkBase64StringToStream', async () => {
    const base64 = utils.arrayBufferToBase64String(new TextEncoder().encode('test string').buffer);
    const chunkBase64 = `${base64}|`;
    const stream = await utils.chunkBase64StringToStream(chunkBase64);
    const resultString = await utils.streamToString(stream);
    expect(resultString).toEqual('test string');
  });

  it('手动补充 asyncFilter 函数测试', async () => {
    // @ts-expect-error 测试用例
    expect(() => utils.asyncFilter('', async () => {})).rejects.toThrow(TypeError);
    // @ts-expect-error 测试用例
    expect(await utils.asyncFilter([''], '')).toEqual(['']);
    // @ts-expect-error 测试用例
    expect(await utils.asyncFilter([''])).toEqual(['']);
  });

  it('手动补充 asyncReplace 函数测试', async () => {
    // @ts-expect-error 测试用例
    expect(() => utils.asyncReplace('', '', 0)).rejects.toThrow(TypeError);
    // @ts-expect-error 测试用例
    expect(await utils.asyncReplace('123', 0, () => {})).toBe('123');
    // @ts-expect-error 测试用例
    expect(await utils.asyncReplace('123', '4', () => {})).toBe('123');
    expect(() => utils.asyncReplace('123', '2', () => {
      throw new Error('test');
    })).rejects.toThrow(Error);
  });

  it('手动补充 merge 函数测试', () => {
    expect(utils.merge(new Set([1]), new Set([2]))).toEqual(new Set([1]));
    expect(utils.merge('', new Set([2]))).toEqual(new Set([2]));
    expect(utils.merge('', 1)).toEqual('');
    expect(utils.merge('1', '2')).toEqual('12');
    expect(utils.merge(1, 2)).toEqual(3);
  });
});
