import type { TAnyFunc, TFunc, TGetReturnType, TObject } from '$/types/base';
import { getType } from '$/utils';
import { curry } from '../function/curry';

type DeepExecResult<F extends TAnyFunc, O extends TObject<any>> = {
  [K in keyof O]: O[K] extends TObject<any> ? DeepExecResult<F, O[K]> : TGetReturnType<F>;
};

export function deepExec_<F extends TFunc<[any, string], any>, O extends TObject<any>>(func: F, specObj: O): DeepExecResult<F, O> {
  const result: DeepExecResult<F, O> = {} as any;

  for (const key in specObj) {
    const item: any = specObj[key];
    if (getType(item) === 'object') {
      result[key] = deepExec_(func, item) as any;
    }
    else {
      result[key] = func(item, key);
    }
  }

  return result;
}

interface DeepExecCurry {
  <F extends TFunc<[any, string], any>, O extends TObject<any>>(func: F, specObj: O): DeepExecResult<F, O>;
  <F extends TFunc<[any, string], any>>(func: F): <O extends TObject<any>>(specObj: O) => DeepExecResult<F, O>;
}

/**
 * 将对象中每个元素都传入函数执行
 *
 * @sig deepExec :: (a -> b) -> {a} -> {b}
 */
export const deepExec = curry(deepExec_) as any as DeepExecCurry;
