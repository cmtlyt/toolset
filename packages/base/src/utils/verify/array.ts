export function isArrayLike(data: any): boolean {
  if (Array.isArray(data))
    return true;
  if (data instanceof String)
    return true;
  if (data && typeof data === 'object' && typeof data.length === 'number')
    return true;
  return false;
}

export function isArray(value: any): value is Array<any>;
export function isArray<T>(value: T[]): value is T[];
export function isArray(value: any): value is Array<any> {
  return Array.isArray(value);
}
