/**
 * 字符串转下划线
 *
 * @sig toUnderlineCase :: string -> string
 */
export const toUnderlineCase = (source: string) => source.replace(/\s*([A-Z])/g, (_, $1) => `_${$1.toLocaleLowerCase()}`);
export const toUnderlineCase_ = toUnderlineCase;
