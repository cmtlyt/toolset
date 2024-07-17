export type TFunc<T extends any[], R = any> = (...args: T) => R;

export type TAnyFunc = TFunc<any[]>;

export type TArgsType<F> = F extends (...args: infer T) => any ? T : any[];

export type THeadType<A extends any[]> = A extends [infer H] ? H : A extends [infer H, ...any[]] ? H : never;

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

export type TObject<T> = Record<string | symbol | number, T>;

export type TArrayItem<T> = T extends [...infer R] ? R : T;

export type TUnwrapPromise<T> = T extends Promise<infer R> ? R : T;

export type TOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type GetArgs<F> = F extends (...args: infer A) => any ? A : [];

export type GetReturnType<F> = F extends (...args: any[]) => infer R ? R : F;

export type TExclude<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type TFlatPromise<T> = T extends Promise<infer R> ? TFlatPromise<R> : Promise<T>;

export type ReverseArray<T extends any[], L = TLength<T>, R extends any[] = []> =
  L extends TLength<[]> ? R : T extends [infer H, ...infer E] ? ReverseArray<E, TLength<E>, TPrepend<H, R>> : [];

export type TRequired<T, K extends keyof T = keyof T> = Omit<T, K> & Required<Pick<T, K>>;
