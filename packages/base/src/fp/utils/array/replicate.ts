import { curry } from '../function';
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
