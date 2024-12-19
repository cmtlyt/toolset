/**
 * @vitest-environment node
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import { getDeviceInfo, getNow, getOsType, safeGetGlobal } from '../src';

describe('utils/node', () => {
  it('getOsType', () => {
    expectTypeOf(getOsType()).toMatchTypeOf<string>();
  });

  it('safeGetGlobal', () => {
    expect(safeGetGlobal()).toBe(globalThis);
  });

  it('getDeviceInfo', () => {
    expectTypeOf(getDeviceInfo()).toMatchTypeOf<{
      platform: string;
      userAgent: string;
      appName: string;
      appVersion: string;
      screenWidth: number;
      screenHeight: number;
      devicePixelRatio: number;
    }>();
  });

  it('getNow', () => {
    expectTypeOf(getNow()).toEqualTypeOf<number>();
  });
});
