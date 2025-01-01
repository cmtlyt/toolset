import { curry } from './function';

export const filter = curry((handle: (item: any, index: number) => boolean, arr: any[]) => {
  return arr.filter((item, index) => handle(item, index));
});

export const map = curry((handle: (item: any, index: number) => any, arr: any[]): any[] => {
  return arr.map((item, index) => handle(item, index));
});

export const reduce = curry((handle: (acc: any, item: any, index: number) => any, init: any, arr: any[]) => {
  return arr.reduce((acc, item, index) => handle(acc, item, index), init);
});

export const every = curry((handle: (item: any, index: number) => boolean, arr: any[]): boolean => {
  return arr.every((item, index) => handle(item, index));
});

export const some = curry((handle: (item: any, index: number) => boolean, arr: any[]): boolean => {
  return arr.some((item, index) => handle(item, index));
});

export const find = curry((handle: (item: any, index: number) => boolean, arr: any[]): any | undefined => {
  return arr.find((item, index) => handle(item, index));
});

export const findIndex = curry((handle: (item: any, index: number) => boolean, arr: any[]): number => {
  return arr.findIndex((item, index) => handle(item, index));
});

export const includes = curry((item: any, arr: any[]) => {
  return arr.includes(item);
});

export const join = curry((separator: string, arr: any[]) => {
  return arr.join(separator);
});
