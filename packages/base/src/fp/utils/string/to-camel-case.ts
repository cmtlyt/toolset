/**
 * 字符串转驼峰
 *
 * @sig toCamelCase :: string -> string
 */
export const toCamelCase = (source: string) => source.replace(/[-\s](\w)/g, (_, $1) => $1.toLocaleUpperCase());
export const toCamelCase_ = toCamelCase;
