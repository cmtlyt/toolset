import { getNow } from '../get-data';

export const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

export function sleepSync(time: number) {
  const start = getNow();
  while (getNow() - start < time);
}
