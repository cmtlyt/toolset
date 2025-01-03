/**
 * 字符串转大写
 *
 * @summary toUpperCase :: string -> string
 */
export const toUpperCase = (source: string) => source.toLocaleUpperCase();
export const toUpperCase_ = toUpperCase;

/**
 * 字符串转小写
 *
 * @summary toLowerCase :: string -> string
 */
export const toLowerCase = (source: string) => source.toLocaleLowerCase();
export const toLowerCase_ = toLowerCase;

/**
 * 字符串转驼峰
 *
 * @summary toCamelCase :: string -> string
 */
export const toCamelCase = (source: string) => source.replace(/[-\s](\w)/g, (_, $1) => $1.toLocaleUpperCase());
export const toCamelCase_ = toCamelCase;

/**
 * 字符串转下划线
 *
 * @summary toUnderlineCase :: string -> string
 */
export const toUnderlineCase = (source: string) => source.replace(/\s*([A-Z])/g, (_, $1) => `_${$1.toLocaleLowerCase()}`);
export const toUnderlineCase_ = toUnderlineCase;

/**
 * 字符串转中划线
 *
 * @summary toKebabCase :: string -> string
 */
export const toKebabCase = (source: string) => source.replace(/\s*([A-Z])/g, (_, $1) => `-${$1.toLocaleLowerCase()}`);
export const toKebabCase_ = toKebabCase;
