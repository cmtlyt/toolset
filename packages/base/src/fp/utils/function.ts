import type { TAnyFunc, TAppend, TArgsType, TCast, TDropHead, TFunc, THeadType, TLastTwoArg, TLastType, TLength } from '$/types/base';
import { getArray } from '$/utils';
import { __ } from './constant';

export type TCurry<P extends any[], R> = <T extends any[]>(
  ...args: TCast<T, Partial<P>>
) => TDropHead<TLength<T>, P> extends [any, ...any[]] ? TCurry<TCast<TDropHead<TLength<T>, P>, any[]>, R> : R;

type TCurryFunc = <P extends any[], R>(fn: (...args: P) => R) => TCurry<P, R>;

/**
 * 函数柯里化
 */
export const curry: TCurryFunc = function (func) {
  // @ts-expect-error 自定义属性, 确保获取到参数列表长度
  const length = func?.clength || func?.length || 0;
  if (!length) {
    throw new TypeError('无法读取函数参数列表的长度，不能使用可选参数和剩余参数！！！');
  }
  const curried = (...args: any) => {
    if (args.length >= length) {
      return func(...args);
    }
    else {
      const tempFunc = (...args2: any) => curried(...args.concat(args2));
      tempFunc.clength = length - args.length;
      return tempFunc;
    }
  };
  curried.clength = length;
  return curried as any;
};

type TCurryFuncReturnType<F> = F extends TCurry<any, infer R> ? R : F extends TAnyFunc ? ReturnType<F> : F;

function _generateRunFunc(funcs: TAnyFunc[], callback: (funcs: TAnyFunc[], ...args: any[]) => any) {
  if (funcs.length === 0)
    return (arg: any) => arg;
  if (funcs.length === 1)
    return funcs[0];
  const runFunc = (...args: any[]) => callback(funcs, ...args)[0];
  return runFunc;
}

type TCompose<T extends TAnyFunc[]> = [...any, TFunc<[TCurryFuncReturnType<TLastType<T>>]>, any];

type TComposeFunc = <F extends TCompose<F>>(
  ...funcs: F
) => (...args: Required<TArgsType<TLastType<F>>>) => TCurryFuncReturnType<THeadType<F>>;

/**
 * 函数组合
 *
 * todo: 类型存在缺陷，只能判断最后输入的函数是否满足条件，不能判断中间的函数
 */
export const compose: TComposeFunc = function compose(...funcs) {
  const func = _generateRunFunc(funcs, (funcs, ...args) =>
    funcs.reduceRight((data, func) => [func(...getArray(data))], args));
  const firstFunc = funcs[funcs.length - 1];
  // @ts-expect-error 自定义属性
  func.clength = firstFunc?.clength || firstFunc?.length;
  return func;
};

type TPipe<T extends TAnyFunc[]> = [...any, any, TFunc<[TCurryFuncReturnType<TLastTwoArg<T>>]>];

type TPipeFunc = <F extends TPipe<F>>(
  ...funcs: F
) => (...args: Required<TArgsType<THeadType<F>>>) => TCurryFuncReturnType<TLastType<F>>;

/**
 * 函数管道
 *
 * todo: 类型存在缺陷，只能判断最后输入的函数是否满足条件，不能判断中间的函数
 */
export const pipe: TPipeFunc = function pipe(...funcs) {
  const func = _generateRunFunc(funcs, (funcs, ...args) =>
    funcs.reduce((data, func) => [func(...getArray(data))], args));
  const firstFunc = funcs[0];
  // @ts-expect-error 自定义属性
  func.clength = firstFunc?.clength || firstFunc?.length;
  return func;
};

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
