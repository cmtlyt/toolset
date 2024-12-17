import type { GetArgs, GetReturnType, TCast, TDropHead, TLength } from '../types/base';
import { EMPTY } from '../common/constant';

export const cacheByReturn: <T extends () => any, R = ReturnType<T>>(
  cacheLoad: T,
) => (...args: GetArgs<R>) => GetReturnType<R> = (() => {
  if (Reflect?.apply) {
    return (cacheLoad) => {
      let cache: any = EMPTY;
      return (...args) => {
        if (cache === EMPTY) cache = cacheLoad();
        if (typeof cache !== 'function') return cache;
        return Reflect.apply(cache, null, args);
      };
    };
  }
  return (cacheLoad) => {
    let cache: any = EMPTY;
    return (...args) => {
      if (cache === EMPTY) cache = cacheLoad();
      if (typeof cache !== 'function') return cache;
      return cache.apply(null, args);
    };
  };
})();

export type TCurry<P extends any[], R> = <T extends any[]>(
  ...args: TCast<T, Partial<P>>
) => TDropHead<TLength<T>, P> extends [any, ...any[]] ? TCurry<TCast<TDropHead<TLength<T>, P>, any[]>, R> : R;

type TCurryFunc = <P extends any[], R>(fn: (...args: P) => R) => TCurry<P, R>;

export const curry: TCurryFunc = function (func) {
  // @ts-expect-error 自定义属性, 确保获取到参数列表长度
  const length = func?.clength || func?.length || 0;
  if (!length) {
    throw new TypeError('无法读取函数参数列表的长度，不能使用可选参数和剩余参数！！！');
  }
  const curried = (...args: any) => {
    if (args.length >= length) {
      return func.apply(null, args);
    } else {
      const tempFunc = (...args2: any) => curried.apply(null, args.concat(args2));
      tempFunc.clength = length - args.length;
      return tempFunc;
    }
  };
  curried.clength = length;
  return curried as any;
};
