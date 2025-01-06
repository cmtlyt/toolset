import { curry } from '../function/curry';
import { makeBy } from './make-by';

interface ReplicateCurry {
  <T>(item: T, count: number): T[];
  <T>(item: T): (count: number) => T[];
}

export function replicate_<T>(item: T, count: number): T[] {
  return makeBy(() => item, count);
}

/**
 * 数组创建
 *
 * @sig replicate :: a -> number -> [a]
 *
 * item 期望是基本数据类型, 否则会导致所有 item 指向同一块内存空间
 */
export const replicate = curry(replicate_) as any as ReplicateCurry;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('replicate', () => {
    expect(replicate(1, 3)).toEqual([1, 1, 1]);
    expect(replicate(1)(3)).toEqual([1, 1, 1]);
  });
}
