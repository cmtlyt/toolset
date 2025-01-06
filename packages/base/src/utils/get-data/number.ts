import { cacheByReturn } from '../func-handler';

/**
 * 获取当前时间
 */
export const getNow = cacheByReturn(() => {
  if (typeof performance !== 'undefined') {
    return () => performance.now();
  }
  return () => Date.now();
});
