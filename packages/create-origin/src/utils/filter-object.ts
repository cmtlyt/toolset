export function filterObject<R extends Record<string, any>>(obj: Record<string, any>): R {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    if (value === undefined)
      return prev;
    (prev as any)[key] = value;
    return prev;
  }, {} as R);
}
