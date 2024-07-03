type TFunc<T extends any[], R = any> = (...args: T) => R;

type TAnyFunc = TFunc<any[]>;

type TArgsType<F> = F extends (...args: infer T) => any ? T : any[];

type THeadType<A extends any[]> = A extends [infer H] ? H : A extends [infer H, ...any[]] ? H : never;

type TLastType<A extends any[]> = A extends [infer L] ? L : A extends [...any[], infer L] ? L : never;

type TTailTypes<A extends any[]> = A extends [any] ? [] : A extends [any, ...infer T] ? T : [];

type TPrepend<T, A extends any[]> = [T, ...A];

type TCast<X, Y> = X extends Y ? X : Y;

type TLength<T extends any[]> = T['length'];

type TDropHead<N extends number, T extends any[], I extends any[] = []> =
  TLength<I> extends N ? T : TDropHead<N, TTailTypes<T>, TPrepend<THeadType<T>, I>>;

type TLastTwoArg<T extends any[]> = T extends [...any, infer I, any] ? I : any;

type THeadTwoArg<T extends any[]> = T extends [any, infer I, ...any] ? I : any;

type TObject<T> = Record<string | symbol | number, T>;

type TArrayItem<T> = T extends [...infer R] ? R : T;

type TUnwrapPromise<T> = T extends Promise<infer R> ? R : T;

type TOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type GetArgs<F> = F extends (...args: infer A) => any ? A : [];

type GetReturnType<F> = F extends (...args: any[]) => infer R ? R : F;

type TExclude<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type TFlatPromise<T> = T extends Promise<infer R> ? TFlatPromise<R> : T;
