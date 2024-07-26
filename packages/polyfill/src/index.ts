import { arrayFromAsync as _arrayFromAsync } from './arrayFromAsync';
import { promiseTry as _promiseTry } from './promiseTry';

export class ClPromise<T> extends Promise<T> {
  // @ts-expect-error 原生支持直接使用原生
  static try = Promise.try || _promiseTry;
}

export class ClArray<T> extends Array<T> {
  static fromAsync: (asyncItems: any, mapfn?: any, thisArg?: any) => Promise<any[]> =
    Array.fromAsync || _arrayFromAsync;
}

export const arrayFromAsync: typeof _arrayFromAsync = _arrayFromAsync.bind(Array);

export const promiseTry: typeof _promiseTry = _promiseTry.bind(Promise);
