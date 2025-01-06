/**
 * 字符串转中划线
 *
 * @sig toKebabCase :: string -> string
 */
export const toKebabCase = (source: string) => source.replace(/([A-Z])/g, (_, $1) => `-${$1.toLocaleLowerCase()}`).replace(/[_\s-]+/g, '-').replace(/^-+/, '');
export const toKebabCase_ = toKebabCase;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('toKebabCase', () => {
    expect(toKebabCase('-webkit-transition')).toBe('webkit-transition');
    expect(toKebabCase('webkit transition')).toBe('webkit-transition');
    expect(toKebabCase('webkit-transition')).toBe('webkit-transition');
    expect(toKebabCase('webkit-Transition')).toBe('webkit-transition');
    expect(toKebabCase('Webkit-Transition')).toBe('webkit-transition');
    expect(toKebabCase('webkit - transition')).toBe('webkit-transition');
  });
}
