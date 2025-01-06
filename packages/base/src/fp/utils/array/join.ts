import { curry } from '../function/curry';

export function join_(separator: string, arr: any[]) {
  return arr.join(separator);
}

/**
 * 数组连接
 *
 * @sig join :: string -> [a] -> string
 */
export const join = curry(join_);

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('join', () => {
    expect(join(',', [1, 2, 3])).toBe('1,2,3');
    expect(join('', [1, 2, 3])).toBe('123');
    expect(join('-', [])).toBe('');
    expect(join('-', [1])).toBe('1');
    expect(join(',')([1, 2, 3])).toBe('1,2,3');
  });
}
