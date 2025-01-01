import { isNull } from '../verify';

export * from '$/fp/utils/array';

type GetArray<T> = T extends any[] ? T : T[];

export function getArray<T>(value?: T): GetArray<T> {
  if (isNull(value))
    return [] as any;
  return Array.isArray(value) ? (value as any) : ([value] as any);
}

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
