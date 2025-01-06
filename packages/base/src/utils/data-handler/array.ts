import { isArray, isArrayLike, isNull } from '../verify';

export * from '$/fp/utils/array';

type GetArray<T> = T extends any[] ? T : T[];

/**
 * 获取数组, 如果不是数组, 则会使用数组包裹, 类数组会使用 Array.from 转换
 */
export function getArray<T>(value?: T): GetArray<T> {
  if (isNull(value))
    return [] as any;
  if (isArray(value))
    return (value as any);
  if (isArrayLike(value))
    return Array.from(value as any) as any;
  return ([value] as any);
}

/**
 * 获取数组切片
 * @param array 原数组
 * @param size 每个字数组的长度
 * @param skip 跳过指定个数的元素
 */
export function getArraySlice<T>(array: T[], size = 0, skip = 0): T[][] {
  if (size <= 0)
    return [array];
  return array.slice(skip).reduce<T[][]>((acc, cur, index) => {
    if (index % size === 0) {
      acc.push([]);
    }
    acc[acc.length - 1].push(cur);
    return acc;
  }, []);
}

/**
 * 异步过滤数组
 * @param arr 数组
 * @param predicate 过滤函数
 */
export async function asyncFilter<T>(
  arr: T[],
  predicate: (item: T, index: number) => Promise<boolean> | boolean,
): Promise<T[]> {
  if (!Array.isArray(arr))
    throw new TypeError('arr 必须是数组');
  if (!predicate || typeof predicate !== 'function')
    return arr;
  return (await Promise.all(arr.map(async (item, idx) => ((await predicate(item, idx)) ? item : null)))).filter(
    Boolean,
  ) as T[];
}
