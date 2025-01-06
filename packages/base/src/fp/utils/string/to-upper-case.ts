/**
 * 字符串转大写
 *
 * @sig toUpperCase :: string -> string
 */
export const toUpperCase = (source: string) => source.toLocaleUpperCase();
export const toUpperCase_ = toUpperCase;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('toUpperCase', () => {
    expect(toUpperCase('Hello World')).toBe('HELLO WORLD');
    expect(toUpperCase('Hello World')).toBe('HELLO WORLD');
    expect(toUpperCase('helloWorld')).toBe('HELLOWORLD');
  });
}
