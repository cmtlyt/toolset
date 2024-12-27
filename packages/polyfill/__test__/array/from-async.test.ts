/* eslint-disable no-useless-call */
/* eslint-disable no-console */
import { describe, it } from 'vitest';

import { arrayFromAsync, ClArray } from '../../src';

describe('array polyfill', () => {
  async function* makeAsyncIterable() {
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      yield i;
    }
  }

  function* makeIterable() {
    for (let i = 0; i < 5; i++) {
      yield i;
    }
  }

  async function* makeAsyncIterableWithThrow() {
    try {
      yield 0;
      throw new Error('error');
    }
    finally {
      console.log('called finally');
    }
  }

  it('arrayFromAsync', ({ expect }) => {
    expect(ClArray.fromAsync(makeAsyncIterable())).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(ClArray.fromAsync(makeAsyncIterable(), item => item * 2)).resolves.toEqual([0, 2, 4, 6, 8]);
    expect(
      ClArray.fromAsync(
        makeAsyncIterable(),
        function (item) {
          return item + this.num;
        },
        { num: 2 },
      ),
    ).resolves.toEqual([2, 3, 4, 5, 6]);
    expect(ClArray.fromAsync(makeAsyncIterable(), {})).rejects.toThrowErrorMatchingInlineSnapshot(
      `[TypeError: mapfn is not callable]`,
    );
    expect(ClArray.fromAsync(makeIterable())).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(ClArray.fromAsync.call(null, makeIterable())).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(ClArray.fromAsync({ length: 5 })).resolves.toEqual(Array.from({ length: 5 }).fill(undefined));
    expect(ClArray.fromAsync.call(null, { length: 5 })).resolves.toEqual(Array.from({ length: 5 }).fill(undefined));
    expect(
      ClArray.fromAsync({ length: 5 }, async (_, i) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return i;
      }),
    ).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(
      ClArray.fromAsync({ length: 5, 0: 10 }, async (item, i) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return i + (item || 0);
      }),
    ).resolves.toEqual([10, 1, 2, 3, 4]);
    expect(ClArray.fromAsync(makeAsyncIterableWithThrow())).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: error]`,
    );

    expect(arrayFromAsync(makeAsyncIterable())).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(arrayFromAsync(makeAsyncIterable(), item => item * 2)).resolves.toEqual([0, 2, 4, 6, 8]);
    expect(
      arrayFromAsync(
        makeAsyncIterable(),
        function (item) {
          return item + this.num;
        },
        { num: 2 },
      ),
    ).resolves.toEqual([2, 3, 4, 5, 6]);
    // @ts-expect-error error
    expect(arrayFromAsync(makeAsyncIterable(), {})).rejects.toThrowErrorMatchingInlineSnapshot(
      `[TypeError: mapfn is not callable]`,
    );
    expect(arrayFromAsync(makeIterable())).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(arrayFromAsync.call(null, makeIterable())).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(arrayFromAsync({ length: 5 })).resolves.toEqual(Array.from({ length: 5 }).fill(undefined));
    expect(arrayFromAsync.call(null, { length: 5 })).resolves.toEqual(Array.from({ length: 5 }).fill(undefined));
    expect(
      arrayFromAsync({ length: 5 }, async (_, i) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return i;
      }),
    ).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(
      arrayFromAsync({ length: 5, 0: 10 }, async (item, i) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return i + (item || 0);
      }),
    ).resolves.toEqual([10, 1, 2, 3, 4]);
    expect(arrayFromAsync(makeAsyncIterableWithThrow())).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: error]`);
  });
});
