import { TAnyFunc, TObject, isConstructor } from '@cmtlyt/base';

export const IsConstructor = isConstructor;

export function CreateDataPropertyOrThrow(Object: any, P: string | symbol | number, V: any) {
  const success = CreateDataProperty(Object, P, V);
  if (!success) throw new TypeError('Failed to create data property on object');
}

export function CreateDataProperty(O: TObject<any>, P: string | symbol | number, V: any) {
  const newDesc = { value: V, writable: true, enumerable: true, configurable: true };
  return Object.defineProperty(O, P, newDesc);
}

export function GetIterator(obj: any, kind: 'SYNC' | 'ASYNC') {
  if (kind === 'ASYNC') {
    const method = GetMethod(obj, Symbol.asyncIterator);
    if (typeof method !== 'undefined') {
      return GetIteratorFromMethod(obj, method);
    } else {
      const syncMethod = GetMethod(obj, Symbol.iterator);
      if (typeof syncMethod === 'undefined') {
        throw new TypeError('Object is not iterable');
      }
      const syncIteratorRecord = GetIteratorFromMethod(obj, syncMethod);
      return CreateAsyncFromSyncIterator(syncIteratorRecord);
    }
  } else {
    const method = GetMethod(obj, Symbol.iterator);
    if (typeof method === 'undefined') {
      throw new TypeError('Object is not iterable');
    }
    return GetIteratorFromMethod(obj, method);
  }
}

export function CreateAsyncFromSyncIterator(syncIteratorRecord: any): any {
  const AsyncFromSyncIteratorPrototype = {
    next: function () {
      const syncIteratorRecord = this['syncIteratorRecord'];
      return new Promise((resolve) => {
        const result = syncIteratorRecord.next();
        resolve(result);
      });
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
  // 创建一个新的对象继承自模拟的异步迭代器原型

  const asyncIterator = Object.create(AsyncFromSyncIteratorPrototype);
  asyncIterator.syncIteratorRecord = syncIteratorRecord;

  // 构造并返回异步迭代器记录
  return {
    asyncIterator,
    next: asyncIterator.next.bind(asyncIterator),
    done: false,
  };
}

export function GetIteratorFromMethod(obj: any, method: TAnyFunc) {
  const iterator = method.call(obj);
  if (!iterator || typeof iterator.next !== 'function') {
    throw new TypeError('Provided method did not return an iterator');
  }
  return {
    next: iterator.next.bind(iterator),
    return: iterator.return && iterator.return.bind(iterator),
    throw: iterator.throw && iterator.throw.bind(iterator),
  };
}

export function Call(func: TAnyFunc, ctx: any, args: any[] = []) {
  args ||= [];
  if (!IsCallable(func)) {
    throw new TypeError('Function is not callable');
  }
  return func.apply(ctx, args);
}

export function IsCallable(func: any) {
  return typeof func === 'function';
}

export function GetMethod(obj: TObject<TAnyFunc>, key: string | symbol | number) {
  const func = obj[key];
  if (typeof func === 'undefined' || func === null) return undefined;
  if (!IsCallable(func)) {
    throw new TypeError('Property is not a function');
  }
  return func;
}
