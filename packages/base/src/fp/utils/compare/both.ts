import type { TFunc } from '$/types/base';

type BothArgs = [TFunc<any[], boolean>, ...TFunc<any[], boolean>[], any];

export function both_(...funcs: BothArgs): boolean {
  const value = funcs.pop() as any;
  return funcs.every(func => func(value));
}

/**
 * 判断所有函数都返回 true
 *
 * @sig both :: (a -> Boolean) -> (a -> Boolean) -> a -> Boolean
 */
export function both(...funcs: [TFunc<any[], boolean>, ...TFunc<any[], boolean>[]]) {
  return (value: any) => both_(...funcs, value);
}
