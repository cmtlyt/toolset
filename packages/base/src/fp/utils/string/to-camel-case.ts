/**
 * 字符串转驼峰
 *
 * @sig toCamelCase :: string -> string
 */
export const toCamelCase = (source: string) => source.replace(/(^|[-\s])+(\w)/g, (_, __, $2) => $2.toLocaleUpperCase());
export const toCamelCase_ = toCamelCase;
