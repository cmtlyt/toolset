/** 函数类型 */
export type TFunc<T extends any[], R = any> = (...args: T) => R;

/** 任意函数 */
export type TAnyFunc = TFunc<any[]>;

/** 获取函数的参数类型 */
export type TArgsType<F> = F extends (...args: infer T) => any ? T : any[];

/** 获取数组的第一个元素类型 */
export type THeadType<A extends any[]> = A extends [infer H] ? H : A extends [infer H, ...any[]] ? H : never;

/** 获取数组的第一个元素类型 */
export type TFirstType<A extends any[]> = A[0];

/** 获取数组的最后一个元素类型 */
export type TLastType<A extends any[], F = never> = A extends [infer L] ? L : A extends [...any[], infer L] ? L : F;

/** 获取数组的剩余元素类型 */
export type TTailTypes<A extends any[]> = A extends [any] ? [] : A extends [any, ...infer T] ? T : [];

/** 获取数组最后一个元素之前的元素类型 */
export type TLastBeforeTypes<A extends any[]> = A extends [...infer T, any] ? T : [];

/** 添加类型到数组头部 */
export type TPrepend<T, A extends any[]> = [T, ...A];

/** 添加类型到数组末尾 */
export type TAppend<T, A extends any[]> = [...A, T];

/** 如果 x 是 y 的子类型, 返回 x, 否则返回 y */
export type TCast<X, Y> = X extends Y ? X : Y;

/** 获取数组的长度 */
export type TLength<T extends any[]> = T['length'];

/** 移除数组前 N 个元素 */
export type TDropHead<N extends number, T extends any[], I extends any[] = []> =
  TLength<I> extends N ? T : TDropHead<N, TTailTypes<T>, TPrepend<THeadType<T>, I>>;

/** 获取数组的倒数第二个元素的类型 */
export type TLastTwoArg<T extends any[]> = T extends [...any, infer I, any] ? I : any;

/** 获取数组的第二个元素的类型 */
export type THeadTwoArg<T extends any[]> = T extends [any, infer I, ...any] ? I : any;

/** 对象类型 */
export type TObject<T, K extends TObjKeyType = TObjKeyType> = Record<K, T>;

/** 获取数组的元素类型 */
export type TArrayItem<T> = T extends [...infer R] ? R : any;

/** 获取数组的类型 */
export type TArrayType<T> = T extends any[] ? T[number] : never;

/** Promise 返回值的类型 */
export type TUnwrapPromise<T> = T extends Promise<infer R> ? R : T;

/** 指定对象的部分属性可选, 如果不指定属性, 则整个对象可选 */
export type TOptional<T, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 获取函数形参类型 */
export type TGetArgs<F> = F extends (...args: infer A) => any ? A : [];

/** 获取函数返回值的类型 */
export type TGetReturnType<F> = F extends (...args: any[]) => infer R ? R : F;

/** 排除对象中的指定属性 */
export type TExclude<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** 扁平化 Promise 类型 */
export type TFlatPromise<T> = T extends Promise<infer R> ? TFlatPromise<R> : Promise<T>;

/** 反转数组类型 */
export type TReverseArray<T extends any[], L = TLength<T>, R extends any[] = []> =
  L extends TLength<[]> ? R : T extends [infer H, ...infer E] ? TReverseArray<E, TLength<E>, TPrepend<H, R>> : [];

/** 指定对象的部分属性必填, 如果不指定属性, 则整个对象必填 */
export type TRequired<T, K extends keyof T = keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** 构造函数 */
export type TConstructor<R, A extends any[] = any[]> = new (...args: A) => R;

/** Promise 构造函数 */
export type TPromiseConstructor<T> = TConstructor<
  Promise<T>,
  [func: (resolve: (data: T) => void, reject: TFunc<any, void>) => any]
>;

/** js 支持的所有类型 (滞后) */
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

/* 指定类型或指定类型的数组 */
export type TMany<T> = T | T[];

/** 对象 key 支持的类型 */
export type TObjKeyType = string | number | symbol;

/** 获取 Promise 返回值的类型 */
export type TPromiseValue<T> = Awaited<T>;

/** 深度获取对象属性的类型 */
export type TDeepGetPropType<K extends string[], T extends TObject<any>, I = T[K[0]]> =
  I extends undefined
    ? undefined : K extends [any]
      ? I : I extends TObject<any>
        ? TDeepGetPropType<TTailTypes<K>, I> : never;

/** 获取指定个数的形参类型 */
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

/** 获取字符串/数字/布尔值常量的类型 */
export type TGetType<T> = T extends string ? string :
  T extends number ? number :
    T extends boolean ? boolean :
      T extends [...infer R] ? R :
        any;
