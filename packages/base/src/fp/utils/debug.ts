import { curry } from './function';

/**
 * 获取组合函数中间的执行结果
 *
 * @summary trace :: (T -> void) -> T -> T
 */
export const trace: <T>(fn: (value: T) => void) => (value: T) => T = curry(<T>(fn: (value: T) => void, value: T) => {
  fn(value);
  return value;
});
