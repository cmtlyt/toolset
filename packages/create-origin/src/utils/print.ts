import { getItem } from '$/store';

export function print(...args: any[]) {
  if (getItem('callOption').noPrint)
    return void 0;
  // eslint-disable-next-line no-console
  return console.log(...args);
}
