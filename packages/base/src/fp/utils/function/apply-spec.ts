import type { TAnyFunc, TFunc } from '$/types/base';
import { curry } from './curry';

type Spec = Record<string, TAnyFunc>;
type DeepSpec = Record<string, Spec | TAnyFunc>;

type ApplySpecReturn<O extends DeepSpec> = { [K in keyof O]:
  O[K] extends DeepSpec
    ? ApplySpecReturn<O[K]>
    : O[K] extends TFunc<any, infer R>
      ? R
      : never;
};

export function applySpec_<O extends DeepSpec>(spec: O, args: any[]) {
  if (typeof spec !== 'object')
    throw new TypeError('Spec must be an object');
  return Object.keys(spec).reduce((acc, key) => {
    const item = spec[key];
    if (typeof item === 'function') {
      // @ts-expect-error any
      acc[key] = spec[key](...args);
    }
    else {
      // @ts-expect-error any
      acc[key] = applySpec_(item, args);
    }
    return acc;
  }, {} as ApplySpecReturn<O>);
}

interface ApplySpecCurry {
  <O extends DeepSpec>(spec: O, args: any[]): ApplySpecReturn<O>;
  <O extends DeepSpec>(spec: O): (args: any[]) => ApplySpecReturn<O>;
}

/**
 * 给定一个递归映射属性到函数的spec对象，通过将每个属性映射到用提供的参数调用其关联函数的结果，创建一个产生相同结构对象的函数
 *
 * @sig applySpec :: {k: ([a, b, …, m] → v)} → [a, b, …, m] → {k: v}
 */
export const applySpec = curry(applySpec_) as any as ApplySpecCurry;
