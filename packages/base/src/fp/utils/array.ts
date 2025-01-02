import { curry } from './function';

/**
 * 数组过滤
 *
 * @summary filter :: ((a, number) -> boolean) -> [a] -> [a]
 */
export const filter = curry((handle: (item: any, index: number) => boolean, arr: any[]) => {
  return arr.filter((item, index) => handle(item, index));
});

/**
 * 数组转换
 *
 * @summary map :: ((a, number) -> b) -> [a] -> [b]
 */
export const map = curry((handle: (item: any, index: number) => any, arr: any[]): any[] => {
  return arr.map((item, index) => handle(item, index));
});

/**
 * 数组聚合
 *
 * @summary reduce :: ((a, b, number) -> a) -> a -> [b] -> a
 */
export const reduce = curry((handle: (acc: any, item: any, index: number) => any, init: any, arr: any[]) => {
  return arr.reduce((acc, item, index) => handle(acc, item, index), init);
});

/**
 * 检测所有数组是否满足条件
 *
 * @summary every :: ((a, number) -> boolean) -> [a] -> boolean
 */
export const every = curry((handle: (item: any, index: number) => boolean, arr: any[]): boolean => {
  return arr.every((item, index) => handle(item, index));
});

/**
 * 检测数组是否有满足条件的元素
 *
 * @summary some :: ((a, number) -> boolean) -> [a] -> boolean
 */
export const some = curry((handle: (item: any, index: number) => boolean, arr: any[]): boolean => {
  return arr.some((item, index) => handle(item, index));
});

/**
 * 查找满足条件的元素
 *
 * @summary find :: ((a, number) -> boolean) -> [a] -> a
 */
export const find = curry((handle: (item: any, index: number) => boolean, arr: any[]): any | undefined => {
  return arr.find((item, index) => handle(item, index));
});

/**
 * 查找满足条件的元素索引
 *
 * @summary findIndex :: ((a, number) -> boolean) -> [a] -> number
 */
export const findIndex = curry((handle: (item: any, index: number) => boolean, arr: any[]): number => {
  return arr.findIndex((item, index) => handle(item, index));
});

/**
 * 检测数组是否有满足条件的元素
 *
 * @summary includes :: a -> [a] -> boolean
 */
export const includes = curry((item: any, arr: any[]) => {
  return arr.includes(item);
});

/**
 * 数组连接
 *
 * @summary join :: string -> [a] -> string
 */
export const join = curry((separator: string, arr: any[]) => {
  return arr.join(separator);
});
