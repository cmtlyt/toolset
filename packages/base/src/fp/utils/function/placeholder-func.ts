import type { TAppend, TDropHead, TFunc, THeadType } from '$/types/base';
import type { TCurryFuncReturnType } from './curry';
import { __ } from '../constant';

type PlaceholderSymbol = typeof __;

type PlaceholderFuncArgs<Args extends any[], Ori extends any[], Last extends any[] = []> =
    Args extends [infer A, ...any]
      ? PlaceholderFuncArgs<
        TDropHead<1, Args>,
        TDropHead<1, Ori>,
        A extends PlaceholderSymbol ? TAppend<THeadType<Ori>, Last> : Last
      >
      : Last;

type PlaceholderArgs<T extends any[], R extends any[] = []> =
  T extends [infer A, ...any] ? PlaceholderArgs<TDropHead<1, T>, TAppend<A | PlaceholderSymbol, R>> : R;

/**
 * 函数支持占位符
 *
 * 包装并返回一个新函数, 新函数允许使用占位符替代传参, 占位符的位置后续传递即可
 *
 * 可选参数会被强制要求填写
 *
 * @warning 占位符只能用于函数参数位置, 函数返回值位置无法使用占位符
 * @warning 无法与 curry 函数一起使用 (无法正确推导类型)! 具体看下方示例
 * @warning 当前包导出的 fp 相关方法为了更好的类型推导大部分都强制指定了多态类型, 所以无法正确推导形参列表
 * 如需要可以使用原始版本 (函数名后加一个下划线 `_`, 例如 `curry 版本[adjust] 原始版本[adjust_]`)
 *
 * @example
 * import { __, placeholderFunc } from '@cmtlyt/base/fp/utils';
 * // const { __ } = placeholderFunc; // 也可以使用 placeholderFunc.__
 * const add = (a: number, b: string, c: number, d: boolean) => a + b + c + d;
 * // const func = curry(placeholderFunc(add)); // 这么使用无法正确推导类型
 * // const func = placeholderFunc(curry(add)); // 这个不影响使用
 * const func = placeholderFunc(add);
 * const f1 = func(1, __, 3, __);
 * f1('2', false); // '123false'
 * // 占位函数生成后可使用 curry 函数包裹
 * const f2 = curry(f1);
 * f2('2', false); // '123false'
 * f2('2')(false); // '123false'
 * f2()('2')(false); // '123false'
 */
export function placeholderFunc<O extends any[], R>(func: TFunc<O, R>) {
  return <A extends PlaceholderArgs<Required<O>>>(...placeArgs: A) => {
    return ((...callArgs) => {
      let index = 0;
      const args = placeArgs.map(arg => arg === __ ? callArgs[index++] : arg);
      if (callArgs.length !== index)
        throw new TypeError('非法调用, 参数数量不匹配');
      return func(...args as any);
    }) as TFunc<PlaceholderFuncArgs<A, Required<O>>, TCurryFuncReturnType<R>>;
  };
}
/**
 * 占位符
 */
placeholderFunc.__ = __;
