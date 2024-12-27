/* eslint-disable no-useless-call */
import { describe, it } from 'vitest';
import { ClPromise, promiseTry } from '../../src';

describe('promise polyfill', () => {
  it('promiseTry', ({ expect }) => {
    expect(ClPromise.try(() => {})).toBeInstanceOf(Promise);
    expect(ClPromise.try((a: number) => a, 1)).resolves.toBe(1);
    expect(ClPromise.try((a: number, b: string, c: boolean) => [c, b, a], 1, '2', true)).resolves.toEqual([
      true,
      '2',
      1,
    ]);
    expect(
      ClPromise.try(() => {
        throw new Error('error');
      }),
    ).rejects.toThrow('error');
    expect(() => ClPromise.try.call(null, () => {})).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: 必须通过 Promise.try 方式调用]`,
    );

    expect(promiseTry(() => {})).toBeInstanceOf(Promise);
    expect(promiseTry((a: number) => a, 1)).resolves.toBe(1);
    expect(promiseTry((a: number, b: string, c: boolean) => [c, b, a], 1, '2', true)).resolves.toEqual([true, '2', 1]);
    expect(
      promiseTry(() => {
        throw new Error('error');
      }),
    ).rejects.toThrow('error');
    expect(promiseTry.call(null, () => {})).resolves.toBeUndefined();
  });
});
