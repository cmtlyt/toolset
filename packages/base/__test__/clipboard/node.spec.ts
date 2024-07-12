// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { clipboard } from '../../src/tools';

describe('node clipboard', () => {
  it('copy', () => {
    expect(clipboard.isCopyable).toBe(false);
  });
});
