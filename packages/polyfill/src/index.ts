import { arrayFromAsync as _arrayFromAsync, type ArrayFromAsync } from './arrayFromAsync';
import { promiseTry as _promiseTry, type PromiseTry } from './promiseTry';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class ClPromise<T> extends Promise<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  static try = Promise.try || _promiseTry;
}

export class ClArray<T> extends Array<T> {
  static fromAsync: (asyncItems: any, mapfn?: any, thisArg?: any) => Promise<any[]> =
    Array.fromAsync || _arrayFromAsync;
}

export const arrayFromAsync: ArrayFromAsync = _arrayFromAsync.bind(Array);

export const promiseTry: PromiseTry = _promiseTry.bind(Promise);
