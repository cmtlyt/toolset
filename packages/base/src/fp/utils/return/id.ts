/**
 * 恒等函数
 *
 * @sig id :: a -> a
 */
export const id = <T>(value: T): T => value;
export const id_ = id;

/**
 * 恒等函数
 *
 * @sig identity :: a -> a
 * @alias id
 */
export const identity = id;
export const identity_ = identity;
