/**
 * 字符串转小写
 *
 * @sig toLowerCase :: string -> string
 */
export const toLowerCase = (source: string) => source.toLocaleLowerCase();
export const toLowerCase_ = toLowerCase;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('toLowerCase', () => {
    expect(toLowerCase('Hello World')).toBe('hello world');
    expect(toLowerCase('Hello World')).toBe('hello world');
    expect(toLowerCase('helloWorld')).toBe('helloworld');
  });
}
