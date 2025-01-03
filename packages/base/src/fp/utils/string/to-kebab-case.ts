/**
 * 字符串转中划线
 *
 * @sig toKebabCase :: string -> string
 */
export const toKebabCase = (source: string) => source.replace(/\s*([A-Z])/g, (_, $1) => `-${$1.toLocaleLowerCase()}`);
export const toKebabCase_ = toKebabCase;
