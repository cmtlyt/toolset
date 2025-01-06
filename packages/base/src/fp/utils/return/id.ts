/**
 * 恒等函数
 *
 * @sig id :: a -> a
 */
export const id = <T>(value: T): T => value;
export const id_ = id;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('id', () => {
    expect(id(1)).toBe(1);
    expect(id(false)).toBe(false);
    expect(id(null)).toBe(null);
  });
}
