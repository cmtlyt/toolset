import type { GetArgs, GetReturnType } from '../types/base';
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
