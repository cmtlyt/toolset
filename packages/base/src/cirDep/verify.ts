export function isString(value: any): boolean {
  return typeof value === 'string';
}

export function isUndef(value: any): boolean {
  return value === 'undefined' || typeof value === 'undefined';
}
