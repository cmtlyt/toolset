// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
// eslint-disable-next-line antfu/no-import-dist
import { gzip, unGzip } from '../dist';

describe('gzip check', () => {
  const str
    = 'hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world';

  it('gzip check', async () => {
    const zipString = await gzip(str);
    expect(zipString).toBeTypeOf('string');
    expect(await unGzip(zipString)).toBe(str);
  });
});
