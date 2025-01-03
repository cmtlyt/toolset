import type { TFunc } from '$/types/base';
import { curry } from './function';

interface FilterCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): T[];
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => T[];
}

export function filter_<T>(handle: (item: T, index: number) => boolean, arr: T[]) {
  return arr.filter((item, index) => handle(item, index));
}

/**
 * 数组过滤
 *
 * @summary filter :: ((a, number) -> boolean) -> [a] -> [a]
 */
export const filter = curry(filter_) as any as FilterCurry;

interface MapCurry {
  <T, R = any>(handle: (item: T, index: number) => R, arr: T[]): R[];
  <T, R = any>(handle: (item: T, index: number) => R): (arr: T[]) => R[];
}

export function map_<T, R>(handle: (item: T, index: number) => R, arr: T[]): R[] {
  return arr.map((item, index) => handle(item, index));
}

/**
 * 数组转换
 *
 * @summary map :: ((a, number) -> b) -> [a] -> [b]
 */
export const map = curry(map_) as any as MapCurry;

interface ReduceCurry {
  <T, R = any>(handle: (acc: R, item: T, index: number) => R, init: R, arr: T[]): R;
  <T, R = any>(handle: (acc: R, item: T, index: number) => R, init: R): (arr: T[]) => R;
  <T, R = any>(handle: (acc: R, item: T, index: number) => R): (init: R) => (arr: T[]) => R;
}

export function reduce_<T, R = T>(handle: (acc: R, item: T, index: number) => R, init: R, arr: T[]) {
  return arr.reduce((acc, item, index) => handle(acc, item, index), init);
}

/**
 * 数组聚合
 *
 * @summary reduce :: ((a, b, number) -> a) -> a -> [b] -> a
 */
export const reduce = curry((handle: (acc: any, item: any, index: number) => any, init: any, arr: any[]) => {
  return arr.reduce((acc, item, index) => handle(acc, item, index), init);
}) as any as ReduceCurry;

interface EveryCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => boolean;
}

export function every_<T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean {
  return arr.every((item, index) => handle(item, index));
}

/**
 * 检测所有数组是否满足条件
 *
 * @summary every :: ((a, number) -> boolean) -> [a] -> boolean
 */
export const every = curry(every_) as any as EveryCurry;

interface SomeCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => boolean;
}

export function some_<T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean {
  return arr.some((item, index) => handle(item, index));
}

/**
 * 检测数组是否有满足条件的元素
 *
 * @summary some :: ((a, number) -> boolean) -> [a] -> boolean
 */
export const some = curry(some_) as any as SomeCurry;

interface FindCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): T | undefined;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => T | undefined;
}

export function find_<T>(handle: (item: T, index: number) => boolean, arr: T[]): T | undefined {
  return arr.find((item, index) => handle(item, index));
}

/**
 * 查找满足条件的元素
 *
 * @summary find :: ((a, number) -> boolean) -> [a] -> a
 */
export const find = curry(find_) as any as FindCurry;

interface FindIndexCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): number;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => number;
}

export function findIndex_<T>(handle: (item: T, index: number) => boolean, arr: T[]): number {
  return arr.findIndex((item, index) => handle(item, index));
}

/**
 * 查找满足条件的元素索引
 *
 * @summary findIndex :: ((a, number) -> boolean) -> [a] -> number
 */
export const findIndex = curry(findIndex_) as any as FindIndexCurry;

interface IncludesCurry {
  <T>(item: T, arr: T[]): boolean;
  <T>(item: T): (arr: T[]) => boolean;
}

export function includes_<T>(item: T, arr: T[]) {
  return arr.includes(item);
}

/**
 * 检测数组是否有满足条件的元素
 *
 * @summary includes :: a -> [a] -> boolean
 */
export const includes = curry(includes_) as any as IncludesCurry;

export function join_(separator: string, arr: any[]) {
  return arr.join(separator);
}

/**
 * 数组连接
 *
 * @summary join :: string -> [a] -> string
 */
export const join = curry(join_);

interface MakeByCurry {
  <R>(handle: (index: number) => R, count: number): R[];
  <R>(handle: (index: number) => R): (count: number) => R[];
}

export function makeBy_<R>(handle: (index: number) => R, count: number): R[] {
  return Array.from({ length: count }, (_, index) => handle(index));
}

/**
 * 数组创建
 *
 * @summary makeBy :: ((number -> a) -> number -> [a])
 */
export const makeBy = curry(makeBy_) as any as MakeByCurry;

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
 * @summary replicate :: a -> number -> [a]
 *
 * item 期望是基本数据类型, 否则会导致所有 item 指向同一块内存空间
 */
export const replicate = curry(replicate_) as any as ReplicateCurry;

interface Partition {
  <R, L = R>(handle: (item: R | L, index: number) => boolean, arr: R | L[]): { left: L[]; right: R[] };
  <R, L = R>(handle: (item: R | L, index: number) => boolean): (arr: R | L[]) => { left: L[]; right: R[] };
}

export function partition_<R, L = R>(handle: TFunc<[R | L, number], boolean>, arr: (R | L)[]): { left: L[]; right: R[] } {
  return reduce((acc, item, index) => {
    acc[handle(item, index) ? 'right' : 'left'].push(item);
    return acc;
  }, { left: [] as any[], right: [] as any[] }, arr);
}

/**
 * 数组分区
 *
 * @summary partition :: ((a, number) -> boolean) -> [a] -> { left: [a], right: [a] }
 */
export const partition = curry(partition_) as any as Partition;

interface AdjustCurry {
  <T>(index: number, handle: (item: T, index: number) => T, arr: T[]): T[];
  <T>(index: number, handle: (item: T, index: number) => T): (arr: T[]) => T[];
  (index: number): <T>(handle: (item: T, index: number) => T, arr: T[]) => T[];
  <T>(index: number): (handle: (item: T, index: number) => T) => (arr: T[]) => T[];
}

export function adjust_<T>(index: number, handle: (item: T, index: number) => T, arr: T[]) {
  const result = [...arr];
  result[index] = handle(result[index], index);
  return result;
}

/**
 * 修改数组指定位置的元素
 *
 * @summary adjust :: number -> ((a, number) -> a) -> [a] -> [a]
 */
export const adjust = curry(adjust_) as any as AdjustCurry;
