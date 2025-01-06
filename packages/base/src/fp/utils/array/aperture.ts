import { curry } from '../function/curry';

export function aperture_<T>(count: number, arr: T[]): T[][] {
  if (count <= 0)
    return [arr];
  count = ~~count;
  return Array.from({ length: Math.ceil(arr.length / count) }, (_, idx) => arr.slice(idx * count, idx * count + count));
}

interface ApertureCurry {
  <T>(count: number, arr: T[]): T[][];
  <T>(count: number): (arr: T[]) => T[][];
}

/**
 * 数组分片
 *
 * @sig aperture :: number -> [a] -> [[a]]
 */
export const aperture = curry(aperture_) as any as ApertureCurry;
