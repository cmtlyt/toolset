// @vitest-environment happy-dom
import { describe, expect, inject, it } from 'vitest';

describe('gzip check', async () => {
  const { gzip, unGzip, unzip, unzipSync, zip, zipSync } = await (() => {
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

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
