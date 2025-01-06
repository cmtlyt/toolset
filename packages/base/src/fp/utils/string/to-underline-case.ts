/**
 * 字符串转下划线
 *
 * @sig toUnderlineCase :: string -> string
 */

export const toUnderlineCase = (source: string) => source.replace(/([A-Z])/g, (_, $1) => `_${$1.toLocaleLowerCase()}`).replace(/[-_\s]+/g, '_').replace(/^_+/, '');
export const toUnderlineCase_ = toUnderlineCase;

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('toUnderlineCase', () => {
    expect(toUnderlineCase('-webkit-transition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkit transition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkit-transition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkit - transition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkitTransition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkit-Transition')).toBe('webkit_transition');
  });
}
