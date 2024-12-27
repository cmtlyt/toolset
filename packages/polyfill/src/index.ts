// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import type { ZipOptions } from './realize/array/zip';
import { arrayFromAsync as _arrayFromAsync, type ArrayFromAsync } from './realize/array/from-async';
import { arrayZip } from './realize/array/zip';
import { promiseTry as _promiseTry, type PromiseTry } from './realize/promise/try';

export class ClPromise<T> extends Promise<T> {
  static try = Promise.try || _promiseTry;
}
export const promiseTry: PromiseTry = _promiseTry.bind(Promise);

export class ClArray<T> extends Array<T> {
  static fromAsync: (asyncItems: any, mapfn?: any, thisArg?: any) => Promise<any[]>
    = Array.fromAsync || _arrayFromAsync;

  static zip: (iterables: any[], options?: ZipOptions) => any[] = Array.zip || arrayZip;
}
export { arrayZip };
export const arrayFromAsync: ArrayFromAsync = _arrayFromAsync.bind(Array);
