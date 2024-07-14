import { createWorkerFunc, getRandomString } from '@cmtlyt/base';

function genKey(keys: string[], length: number) {
  let id: string,
    count = 0;
  const total = 36 ** length;
  while (keys.includes((id = getRandomString(length))) && ++count < total);
  return id;
}

function getPreKey(_c: number) {
  // return `#${c}:`;
  return `#`;
}

function _zip(source: string, keyLength: number, preKey = '#', map: Record<string, string> = {}) {
  const keyReg = new RegExp(`(^{.*?(.{${keyLength}})})|({.*?(.{${keyLength}})}$)`);
  const wrapLen = preKey.length + 2;
  for (let i = 0; i++ < source.length; ) {
    const sliceStr = source.slice(i, i + keyLength + wrapLen);
    if (source.includes(sliceStr, i + keyLength + wrapLen)) {
      for (let j = i + keyLength + wrapLen + 1; j++ < source.length; ) {
        const sliceStr_ = source.slice(i, j);
        if (!source.includes(sliceStr_, j)) {
          const key = genKey(Object.keys(map), keyLength);
          const cacheStr = source.slice(i, j - 1);
          if (keyReg.test(cacheStr)) break;
          map[key] = cacheStr;
          source = source.replace(new RegExp(cacheStr.replace(/([[{(?)\\])/g, '\\$1'), 'g'), `{${preKey}${key}}`);
          i = i + 9;
          break;
        }
      }
    }
  }
  return source;
}

// export function zip(source: string, keyLength: number = 6, level = 1) {
//   let resultStr = source;
//   for (let c = 0; c++ < level; ) {
//     const map = {};
//     const result = _zip(resultStr, keyLength, getPreKey(c), map);
//     resultStr = JSON.stringify({ cache: map, source: result, keyLength, level });
//   }
//   return resultStr;
// }

export function zipSync(source: string, keyLength: number = 6) {
  const map = {};
  const result = _zip(source, keyLength, getPreKey(0), map);
  return JSON.stringify({ cache: map, source: result, keyLength });
}

export const { run: zip } = createWorkerFunc(zipSync, [_zip, getPreKey, genKey, getRandomString], { reuse: false });

interface ZipSource {
  cache: Record<string, string>;
  source: string;
  keyLength: number;
}

function _unzip(zipSource: ZipSource, preKey = '#') {
  const { keyLength, cache } = zipSource;
  let { source } = zipSource;
  let match: RegExpExecArray;
  while ((match = new RegExp(`{${preKey}(.{${keyLength}})}`, 'g').exec(source))) {
    const [placeStr, key] = Array.from(match);
    source = source.replace(new RegExp(placeStr, 'g'), cache[key]);
  }
  return source;
}

// export function unzip(zipSource: string) {
//   let zipInfo = JSON.parse(zipSource);
//   const { level } = zipInfo;
//   let result: string;
//   for (let c = level; c > 0; --c) {
//     result = _unzip(zipInfo, getPreKey(c));
//     if (c > 1) {
//       zipInfo = JSON.parse(result);
//     }
//   }
//   return result;
// }

export function unzipSync(zipSource: string) {
  const zipInfo = JSON.parse(zipSource);
  const result = _unzip(zipInfo, getPreKey(0));
  return result;
}

export const { run: unzip } = createWorkerFunc(unzipSync, [_unzip, getPreKey, genKey, getRandomString], {
  reuse: false,
});
