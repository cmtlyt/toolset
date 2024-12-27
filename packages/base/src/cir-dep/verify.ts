export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isUndef(value: any): value is undefined {
  return value === 'undefined' || typeof value === 'undefined';
}
