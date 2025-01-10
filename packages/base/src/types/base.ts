export type TFunc<T extends any[], R = any> = (...args: T) => R;

export type TAnyFunc = TFunc<any[]>;

export type TArgsType<F> = F extends (...args: infer T) => any ? T : any[];

export type THeadType<A extends any[]> = A extends [infer H] ? H : A extends [infer H, ...any[]] ? H : never;

export type TFirstType<A extends any[]> = A[0];

export type TLastType<A extends any[]> = A extends [infer L] ? L : A extends [...any[], infer L] ? L : never;

export type TTailTypes<A extends any[]> = A extends [any] ? [] : A extends [any, ...infer T] ? T : [];

export type TPrepend<T, A extends any[]> = [T, ...A];

export type TAppend<T, A extends any[]> = [...A, T];

export type TCast<X, Y> = X extends Y ? X : Y;

export type TLength<T extends any[]> = T['length'];

export type TDropHead<N extends number, T extends any[], I extends any[] = []> =
  TLength<I> extends N ? T : TDropHead<N, TTailTypes<T>, TPrepend<THeadType<T>, I>>;

export type TLastTwoArg<T extends any[]> = T extends [...any, infer I, any] ? I : any;

export type THeadTwoArg<T extends any[]> = T extends [any, infer I, ...any] ? I : any;

export type TObject<T> = Record<TObjKeyType, T>;

export type TArrayItem<T> = T extends [...infer R] ? R : T;

export type TUnwrapPromise<T> = T extends Promise<infer R> ? R : T;

export type TOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type TGetArgs<F> = F extends (...args: infer A) => any ? A : [];

export type TGetReturnType<F> = F extends (...args: any[]) => infer R ? R : F;

export type TExclude<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type TFlatPromise<T> = T extends Promise<infer R> ? TFlatPromise<R> : Promise<T>;

export type TReverseArray<T extends any[], L = TLength<T>, R extends any[] = []> =
  L extends TLength<[]> ? R : T extends [infer H, ...infer E] ? TReverseArray<E, TLength<E>, TPrepend<H, R>> : [];

export type TRequired<T, K extends keyof T = keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type TConstructor<R, A extends any[] = any[]> = new (...args: A) => R;

export type TPromiseConstructor<T> = TConstructor<
  Promise<T>,
  [func: (resolve: (data: T) => void, reject: TFunc<any, void>) => any]
>;

export type TAllType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'function'
  | 'asyncfunction'
  | 'generatorfunction'
  | 'promise'
  | 'symbol'
  | 'set'
  | 'map'
  | 'weakset'
  | 'weakmap'
  | 'date'
  | 'regexp'
  | 'error'
  | 'null'
  | 'undefined'
  | 'bigint'
  | 'file'
  | 'url'
  | 'urlsearchparams'
  | 'formdata'
  | 'arraybuffer'
  | 'dataview'
  | 'int8array'
  | 'uint8array'
  | 'uint8clampedarray'
  | 'int16array'
  | 'uint16array'
  | 'int32array'
  | 'uint32array'
  | 'float32array'
  | 'float64array'
  | 'bigint64array'
  | 'biguint64array'
  | 'blob';

export type TMany<T> = T | T[];

export type TObjKeyType = string | number | symbol;

export type TPromiseValue<T> = Awaited<T>;

export type TDeepGetPropType<K extends string[], T extends TObject<any>, I = T[K[0]]> =
  I extends undefined
    ? undefined : K extends [any]
      ? I : I extends TObject<any>
        ? TDeepGetPropType<TTailTypes<K>, I> : never;

export type TGetArgsWithCount<F extends TAnyFunc, C extends number, A extends any[] = TGetArgs<F>, R extends any[] = []> =
  A['length'] extends 0 ? R :
    R['length'] extends C
      ? R
      : TGetArgsWithCount<
        F,
        C,
        THeadType<A> extends never ? A : TTailTypes<A>,
        [...R, TFirstType<A>]
      >;

export type TGetType<T> = T extends string ? string :
  T extends number ? number :
    T extends boolean ? boolean :
      any;
