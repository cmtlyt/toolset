import type { TObject, TObjKeyType } from '$/types/base';
import { STATIC_TYPE } from '$/common/constant';
import { warning } from '$/common/warning';
import { cacheByReturn, tryCall } from '../func-handler';
import { getType } from '../get-data';

/**
 * 深度克隆对象
 */
export function deepClone<T extends TObject<any>>(obj: T, hash = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object' || STATIC_TYPE.includes(getType(obj)))
    return obj;
  if (hash.has(obj))
    return hash.get(obj);

  const newObj: TObject<any> = Array.isArray(obj) ? [] : {};
  hash.set(obj, newObj);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepClone(obj[key], hash);
    }
  }
  return newObj as any;
}

function _merge(target: any, source: any) {
  const targetType = getType(target);
  if (STATIC_TYPE.includes(targetType))
    return target;
  if (targetType !== getType(source)) {
    if (STATIC_TYPE.includes(getType(source)))
      return source;
    warning('传入的两个参数类型不同,无法合并');
    return target;
  }
  if (targetType === 'string' || targetType === 'number')
    return target + source;
  if (Array.isArray(target))
    return target.concat(source);
  if (targetType === 'object') {
    for (const key in source) {
      const item = source[key];
      let current = target[key] ?? item;
      if (!STATIC_TYPE.includes(getType(current)) && typeof item === 'object' && item !== null) {
        current = target[key] || (Array.isArray(item) ? [] : {});
        current = _merge(current, item);
      }
      target[key] = current;
    }
  }
  return target || source;
}

/**
 * 合并对象, 会直接修改 target
 *
 * 如不希望修改 target 对象, 请使用 cloneMerge
 */
export function merge(target: any, ...source: any[]) {
  return source.reduce((acc, cur) => _merge(acc, cur), target);
}

/**
 * 合并对象, 返回新对象, 不影响原数据
 */
export function cloneMerge(target: any, ...source: any) {
  target = deepClone(target);
  return merge(target, ...source);
}

export const fromEntries = cacheByReturn(() => {
  if (typeof Object.fromEntries === 'function')
    return (entires: Iterable<readonly [PropertyKey, any]>) => Object.fromEntries(entires);
  if (typeof Array.from === 'function' && typeof Object.assign === 'function') {
    return (entires: Iterable<readonly [PropertyKey, any]>) => {
      const obj: TObject<any> = {};
      Array.from(entires, ([key, val]) => obj[key] = val);
      return obj;
    };
  }
  return (entires: Iterable<readonly [PropertyKey, any]>) => {
    const obj: any = {};
    tryCall(() => {
      for (const [key, val] of entires) {
        obj[key] = val;
      }
    }, () => {
      const iterable = entires[Symbol.iterator]();
      let curr = iterable.next();
      while (!curr.done) {
        const [key, val] = curr.value;
        obj[key] = val;
        curr = iterable.next();
      }
    });
    return obj;
  };
});

/**
 * 遍历对象, 参考数组的 forEach
 *
 * @warning 不保证遍历顺序
 */
export const objectForEach = cacheByReturn((): ((obj: TObject<any>, callback: (value: any, key: string) => any) => void) => {
  if (typeof Object.entries === 'function') {
    return (obj, callback) => {
      Object.entries(obj).forEach(([key, value]) => callback(value, key));
    };
  }
  return (obj, callback) => {
    Object.keys(obj).forEach((key) => {
      callback(obj[key], key);
    });
  };
});

/**
 * 遍历对象, 参考数组的 map
 *
 * @warning 不保证遍历顺序
 */
export const objectMap = cacheByReturn((): ((obj: TObject<any>, callback: (value: any, key: string) => any) => TObject<any>) => {
  if (typeof Object.entries === 'function') {
    return (obj, callback) => {
      return fromEntries(Object.entries(obj).map(([key, value]) => [key, callback(value, key)]));
    };
  }
  return (obj, callback) => {
    const newObj: TObject<any> = {};
    Object.keys(obj).forEach((key) => {
      newObj[key] = callback(obj[key], key);
    });
    return newObj;
  };
});

/**
 * 遍历对象, 参考数组的 filter
 *
 * @warning 不保证遍历顺序
 */
export const objectFilter = cacheByReturn((): ((obj: TObject<any>, callback: (value: any, key: string) => boolean) => TObject<any>) => {
  if (typeof Object.entries === 'function') {
    return (obj, callback) => {
      return fromEntries(Object.entries(obj).filter(([key, value]) => callback(value, key)));
    };
  }
  return (obj, callback) => {
    const newObj: TObject<any> = {};
    Object.keys(obj).forEach((key) => {
      if (callback(obj[key], key)) {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  };
});

/**
 * 遍历对象, 参考数组的 reduce
 *
 * @warning 不保证遍历顺序
 */
export const objectReduce = cacheByReturn((): (<T>(obj: TObject<any>, callback: (previousValue: T, currentValue: any, currentKey: TObjKeyType, obj: TObject<any>) => any, initialValue: T) => T) => {
  if (typeof Object.entries === 'function') {
    return (obj, callback, initialValue) => {
      return Object.entries(obj).reduce((previousValue, [key, value]) => callback(previousValue, value, key, obj), initialValue);
    };
  }
  return (obj, callback, initialValue) => {
    return Object.keys(obj).reduce((previousValue, key) => callback(previousValue, obj[key], key, obj), initialValue);
  };
});

/**
 * 遍历对象, 参考数组的 some
 *
 * @warning 不保证遍历顺序
 */
export const objectSome = cacheByReturn((): ((obj: TObject<any>, callback: (value: any, key: string) => boolean) => boolean) => {
  if (typeof Object.entries === 'function') {
    return (obj, callback) => {
      return Object.entries(obj).some(([key, value]) => callback(value, key));
    };
  }
  return (obj, callback) => {
    return Object.keys(obj).some(key => callback(obj[key], key));
  };
});

/**
 * 遍历对象, 参考数组的 every
 *
 * @warning 不保证遍历顺序
 */
export const objectEvery = cacheByReturn((): ((obj: TObject<any>, callback: (value: any, key: string) => boolean) => boolean) => {
  if (typeof Object.entries === 'function') {
    return (obj, callback) => {
      return Object.entries(obj).every(([key, value]) => callback(value, key));
    };
  }
  return (obj, callback) => {
    return Object.keys(obj).every(key => callback(obj[key], key));
  };
});
