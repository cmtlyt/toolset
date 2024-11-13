import {
  cacheByReturn,
  caniuse,
  chunkBase64StringToStream,
  streamToChunkBase64String,
  streamToString,
  stringToStream,
} from '@cmtlyt/base';

import { unzipSync, zipSync } from './dictZip';

const caniuseGip = cacheByReturn(() => {
  return (
    caniuse('TextEncoder') &&
    caniuse('ReadableStream') &&
    caniuse('ArrayBuffer') &&
    caniuse('Uint8Array') &&
    caniuse('btoa') &&
    caniuse('atob') &&
    caniuse('TextDecoder')
  );
});

export async function gzip(source: string, keyLength: number = 6) {
  if (!caniuse('CompressionStream') || !caniuseGip()) return zipSync(source, keyLength);

  const compressedStream = stringToStream(source).pipeThrough(new CompressionStream('gzip'));

  return streamToChunkBase64String(compressedStream);
}

export async function unGzip(zipSource: string) {
  if (!caniuse('DecompressionStream') || !caniuseGip()) return unzipSync(zipSource);

  const stream = await chunkBase64StringToStream(zipSource);
  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));

  return streamToString(decompressedStream);
}
