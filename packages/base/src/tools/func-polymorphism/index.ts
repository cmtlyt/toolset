import type { TAnyFunc, TAppend, TLastBeforeTypes, TLastType, TObject, TTailTypes } from '$/types/base';

interface TypeMap {
  string: string;
  number: number;
  boolean: boolean;
  array: any[];
  object: TObject<any>;
  function: (...args: any[]) => any;
  any: any;
  unknown: unknown;
  undefined: undefined;
  void: void;
  null: null;
}

type TypeMapKeys = keyof TypeMap;

// @ts-expect-error H 是可以正常索引 TypeMap 的, 否则前置的类型就会报错
type FuncTypes<A extends any[], R extends any[] = []> = A extends [infer H, ...any[]] ? FuncTypes<TTailTypes<A>, TAppend<TypeMap[H], R>> : R;

type FuncInMap<F extends TAnyFunc, M extends TAnyFunc> = M extends F ? F : never;

interface RegisterFunc<M extends TAnyFunc> {
  <
    A extends TypeMapKeys[],
    T extends any[] = FuncTypes<A>,
    F extends (...args: TLastBeforeTypes<T>) => TLastType<T, void> = (...args: TLastBeforeTypes<T>) => TLastType<T, void>,
  >(func: FuncInMap<F, M>, ...args: A): any;
  <
    A extends TypeMapKeys[],
    T extends any[] = FuncTypes<A>,
    F extends (...args: TLastBeforeTypes<T>) => TLastType<T, void> = (...args: TLastBeforeTypes<T>) => TLastType<T, void>,
  >(func: FuncInMap<F, M>, matchFunc: (args: any[], types: A) => boolean, ...args: A): any;
}

interface PolymorphismController<M extends TAnyFunc> {
  register: RegisterFunc<M>;
}

export type PolymorphismInstance<T extends TAnyFunc> = T & PolymorphismController<T>;

interface FuncImpl {
  callback: TAnyFunc;
  matchFunc?: TAnyFunc;
  types: string[];
}

type FuncImplInfo = Partial<Record<'match' | 'base', FuncImpl>>;

function joinTypes(types: string[]) {
  return types.join('|');
}

function callFuncImpl(funcImplInfo: FuncImplInfo, args: any[]) {
  const { match: matchImpl, base: baseImpl } = funcImplInfo;
  if (matchImpl) {
    const matchResult = matchImpl.matchFunc!(args, matchImpl.types);
    if (matchResult) {
      return matchImpl.callback(...args);
    }
  }
  if (!baseImpl) {
    throw new TypeError('没有找到匹配的函数');
  }
  return baseImpl.callback(...args);
}

export function createFuncPolymorphism<T extends TAnyFunc>(): PolymorphismInstance<T> {
  const funcImplInfoMap: Record<string, FuncImplInfo> = {};

  const controller: PolymorphismController<T> = {
    register(func: TAnyFunc, ...args: any[]) {
      if (typeof func !== 'function') {
        throw new TypeError('第一个参数必须为 function 类型');
      }
      const [matchFunc, ...types] = args;
      const isMatchFunc = typeof matchFunc === 'function';
      if (isMatchFunc) {
        types.unshift(matchFunc);
      }
      if (types.some(item => typeof item !== 'string')) {
        throw new TypeError('剩余参数必须为 string 类型');
      }
      const funcImpl = {
        callback: func,
        types: types.map((item) => {
          if (item === 'void')
            return 'undefined';
          if (item === 'unknown')
            return 'any';
          return item;
        }),
        matchFunc: isMatchFunc ? matchFunc : undefined,
      };
      funcImplInfoMap[joinTypes(types)] = { [isMatchFunc ? 'match' : 'base']: funcImpl };

      return this;
    },
  };

  return new Proxy((...args: any[]) => {
    const argsType = joinTypes(args.map(item => typeof item));
    const funcImplInfo = funcImplInfoMap[argsType];
    if (!funcImplInfo) {
      throw new TypeError(`没有找到匹配的函数, 参数类型: ${argsType}`);
    }
    return callFuncImpl(funcImplInfo, args);
  }, {
    get(target, prop, receiver) {
      if (prop in controller) {
        return (controller as any)[prop].bind(target);
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as any;
}
