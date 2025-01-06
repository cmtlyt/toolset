import { curry } from './function/curry';

/**
 * 获取组合函数中间的执行结果
 *
 * @sig trace :: (T -> void) -> T -> T
 */
export const trace: <T>(fn: (value: T) => void) => (value: T) => T = curry(<T>(fn: (value: T) => void, value: T) => {
  try {
    fn(value);
  }
  catch {}
  return value;
});

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('trace', () => {
    expect(trace(v => expect(v).toBe(1))(1)).toBe(1);
    expect(trace(v => v)(1)).toBe(1);
    expect(trace((v) => {
      throw new Error(`${v}`);
    })(1)).toBe(1);
  });
}
