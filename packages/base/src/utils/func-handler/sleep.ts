import { getNow } from '../get-data';

/**
 * promise 休眠
 * @param time 休眠时间 (ms)
 */
export const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

/**
 * 同步休眠
 * @param time 休眠时间 (ms)
 */
export function sleepSync(time: number) {
  const start = getNow();
  while (getNow() - start < time);
}
