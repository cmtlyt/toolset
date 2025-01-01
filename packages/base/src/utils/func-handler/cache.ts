import type { GetArgs, GetReturnType, TAnyFunc } from '$/types/base';
import { EMPTY } from '$/common/constant';

export function onceFunc<T extends TAnyFunc>(func: T): T {
  let called = false;
  let result: ReturnType<T> | null = null;
  return function (...args) {
    if (called)
      return result;
    called = true;
    return (result = func(...args));
  } as T;
}

class MemoizeMap {
  #_map = new Map();
  #_weakMap = new WeakMap();

  #_isObject(key: any) {
    return typeof key === 'object' && key !== null;
  }

  set(key: any, value: any) {
    if (this.#_isObject(key)) {
      this.#_weakMap.set(key, value);
    }
    else {
      this.#_map.set(key, value);
    }
  }

  get(key: any) {
    if (this.#_isObject(key)) {
      return this.#_weakMap.get(key);
    }
    return this.#_map.get(key);
  }

  has(key: any) {
    if (this.#_isObject(key)) {
      return this.#_weakMap.has(key);
    }
    return this.#_map.has(key);
  }
}

export function memoize<F extends (...args: any[]) => any>(func: F, resolver?: (...args: GetArgs<F>) => any) {
  const memoized = function (...args: GetArgs<F>): GetReturnType<F> {
    const key = resolver ? resolver(...args) : args[0];
    const cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
  memoized.cache = new MemoizeMap();
  return memoized;
}

export const cacheByReturn: <T extends () => any, R = ReturnType<T>>(
  cacheLoad: T,
) => (...args: GetArgs<R>) => GetReturnType<R> = (() => {
  if (Reflect?.apply) {
    return (cacheLoad) => {
      let cache: any = EMPTY;
      return (...args) => {
        if (cache === EMPTY)
          cache = cacheLoad();
        if (typeof cache !== 'function')
          return cache;
        return Reflect.apply(cache, null, args);
      };
    };
  }
  return (cacheLoad) => {
    let cache: any = EMPTY;
    return (...args) => {
      if (cache === EMPTY)
        cache = cacheLoad();
      if (typeof cache !== 'function')
        return cache;
      return cache(...args);
    };
  };
})();
