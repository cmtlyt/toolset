/**
 * 字符串转中划线
 *
 * @sig toKebabCase :: string -> string
 */
export const toKebabCase = (source: string) => source.replace(/([A-Z])/g, (_, $1) => `-${$1.toLocaleLowerCase()}`).replace(/[_\s-]+/g, '-').replace(/^-+/, '');
export const toKebabCase_ = toKebabCase;
