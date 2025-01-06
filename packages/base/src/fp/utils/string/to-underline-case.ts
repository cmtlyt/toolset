/**
 * 字符串转下划线
 *
 * @sig toUnderlineCase :: string -> string
 */

export const toUnderlineCase = (source: string) => source.replace(/([A-Z])/g, (_, $1) => `_${$1.toLocaleLowerCase()}`).replace(/[-_\s]+/g, '_').replace(/^_+/, '');
export const toUnderlineCase_ = toUnderlineCase;
