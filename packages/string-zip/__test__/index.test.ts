// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';

import { gzip, unGzip, unzip, unzipSync, zip, zipSync } from '../src';

describe('gzip check', () => {
  const str
    = 'hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world';

  it('gzip check', async () => {
    const zipString = await gzip(str);
    expect(zipString).toBeTypeOf('string');
    expect(await unGzip(zipString)).toBe(str);
  });

  it('zip', async () => {
    const zipString = await zip(str);
    expect(zipString).toBeTypeOf('string');
    expect(await unzip(zipString)).toBe(str);
  });

  it('zipSync', () => {
    const zipString = zipSync(str);
    expect(zipString).toBeTypeOf('string');
    expect(unzipSync(zipString)).toBe(str);
  });
});
