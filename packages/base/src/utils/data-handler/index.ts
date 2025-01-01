import { warning } from '$/common/warning';

export * from './array';
export * from './object';
export * from './string';
export * from './transform';

export function formatDate(date = new Date(), format?: string) {
  warning('未来会实现~');
  if (!format)
    return `${date.valueOf()}`;
  // todo format
  return date.toLocaleString();
}
