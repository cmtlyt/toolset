import { curry } from './function/curry';

/**
 * 获取组合函数中间的执行结果
 *
 * @sig trace :: (T -> void) -> T -> T
 */
export const trace: <T>(fn: (value: T) => void) => (value: T) => T = curry(<T>(fn: (value: T) => void, value: T) => {
  try {
    fn(value);
  }
  catch {}
  return value;
});
