// @vitest-environment happy-dom

import {describe, it, expect} from 'vitest';
import { gzip, unGzip } from '../src';

describe('gzip check', () => { 
  const str =
    'hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world';

  it('gzip check', async () => {
    const zipString = await gzip(str);
    expect(zipString).toBeTypeOf('string');
    expect(await unGzip(zipString)).toBe(str);
  });
});
