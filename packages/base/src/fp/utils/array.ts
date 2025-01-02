import type { TAnyFunc } from '$/types/base';
import { curry } from './function';

interface FilterCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): T[];
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => T[];
}

/**
 * 数组过滤
 *
 * @summary filter :: ((a, number) -> boolean) -> [a] -> [a]
 */
export const filter = curry((handle: (item: any, index: number) => boolean, arr: any[]) => {
  return arr.filter((item, index) => handle(item, index));
}) as any as FilterCurry;

interface MapCurry {
  <T, R = any>(handle: (item: T, index: number) => R, arr: T[]): R[];
  <T, R = any>(handle: (item: T, index: number) => R): (arr: T[]) => R[];
}

/**
 * 数组转换
 *
 * @summary map :: ((a, number) -> b) -> [a] -> [b]
 */
export const map = curry((handle: (item: any, index: number) => any, arr: any[]): any[] => {
  return arr.map((item, index) => handle(item, index));
}) as any as MapCurry;

interface ReduceCurry {
  <T, R = any>(handle: (acc: R, item: T, index: number) => R, init: R, arr: T[]): R;
  <T, R = any>(handle: (acc: R, item: T, index: number) => R, init: R): (arr: T[]) => R;
  <T, R = any>(handle: (acc: R, item: T, index: number) => R): (init: R) => (arr: T[]) => R;
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

/**
 * 检测所有数组是否满足条件
 *
 * @summary every :: ((a, number) -> boolean) -> [a] -> boolean
 */
export const every = curry((handle: (item: any, index: number) => boolean, arr: any[]): boolean => {
  return arr.every((item, index) => handle(item, index));
}) as any as EveryCurry;

interface SomeCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): boolean;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => boolean;
}

/**
 * 检测数组是否有满足条件的元素
 *
 * @summary some :: ((a, number) -> boolean) -> [a] -> boolean
 */
export const some = curry((handle: (item: any, index: number) => boolean, arr: any[]): boolean => {
  return arr.some((item, index) => handle(item, index));
}) as any as SomeCurry;

interface FindCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): T | undefined;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => T | undefined;
}

/**
 * 查找满足条件的元素
 *
 * @summary find :: ((a, number) -> boolean) -> [a] -> a
 */
export const find = curry((handle: (item: any, index: number) => boolean, arr: any[]): any | undefined => {
  return arr.find((item, index) => handle(item, index));
}) as any as FindCurry;

interface FindIndexCurry {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): number;
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => number;
}

/**
 * 查找满足条件的元素索引
 *
 * @summary findIndex :: ((a, number) -> boolean) -> [a] -> number
 */
export const findIndex = curry((handle: (item: any, index: number) => boolean, arr: any[]): number => {
  return arr.findIndex((item, index) => handle(item, index));
}) as any as FindIndexCurry;

interface IncludesCurry {
  <T>(item: T, arr: T[]): boolean;
  <T>(item: T): (arr: T[]) => boolean;
}

/**
 * 检测数组是否有满足条件的元素
 *
 * @summary includes :: a -> [a] -> boolean
 */
export const includes = curry((item: any, arr: any[]) => {
  return arr.includes(item);
}) as any as IncludesCurry;

/**
 * 数组连接
 *
 * @summary join :: string -> [a] -> string
 */
export const join = curry((separator: string, arr: any[]) => {
  return arr.join(separator);
});

interface MakeByCurry {
  <R>(handle: (index: number) => R, count: number): R[];
  <R>(handle: (index: number) => R): (count: number) => R[];
}

/**
 * 数组创建
 *
 * @summary makeBy :: ((number -> a) -> number -> [a])
 */
export const makeBy = curry((handle: (index: number) => any, count: number) => {
  return Array.from({ length: count }, (_, index) => handle(index));
}) as any as MakeByCurry;

interface ReplicateCurry {
  <T>(item: T, count: number): T[];
  <T>(item: T): (count: number) => T[];
}

/**
 * 数组创建
 *
 * @summary replicate :: a -> number -> [a]
 *
 * item 期望是基本数据类型, 否则会导致所有 item 指向同一块内存空间
 */
export const replicate = curry((item: any, count: number) => {
  return makeBy(() => item, count);
}) as any as ReplicateCurry;

interface Partition {
  <T>(handle: (item: T, index: number) => boolean, arr: T[]): { left: any[]; right: T[] };
  <T>(handle: (item: T, index: number) => boolean): (arr: T[]) => { left: any[]; right: T[] };
}

/**
 * 数组分区
 *
 * @summary partition :: ((a, number) -> boolean) -> [a] -> { left: [a], right: [a] }
 */
export const partition = curry((handle: TAnyFunc, arr: any[]) => {
  return reduce((acc, item, index) => {
    acc[handle(item, index) ? 'right' : 'left'].push(item);
    return acc;
  }, { left: [] as any[], right: [] as any[] }, arr);
}) as any as Partition;

interface AdjustCurry {
  <T>(index: number, handle: (item: T, index: number) => T, arr: T[]): T[];
  <T>(index: number, handle: (item: T, index: number) => T): (arr: T[]) => T[];
  (index: number): <T>(handle: (item: T, index: number) => T, arr: T[]) => T[];
  <T>(index: number): (handle: (item: T, index: number) => T) => (arr: T[]) => T[];
}

/**
 * 修改数组指定位置的元素
 *
 * @summary adjust :: number -> ((a, number) -> a) -> [a] -> [a]
 */
export const adjust = curry((index: number, handle: (item: any, index: number) => any, arr: any[]) => {
  const result = [...arr];
  result[index] = handle(result[index], index);
  return result as any;
}) as any as AdjustCurry;
