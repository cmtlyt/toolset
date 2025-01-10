import type { TFunc } from '$/types/base';
import { curry } from '../function/curry';

export function when_<
  T,
  R,
  WF extends TFunc<[T], boolean>,
  TF extends TFunc<[T], R>,
>(whenFunc: WF, thenFunc: TF, arg: T): R | T {
  return whenFunc(arg) ? thenFunc(arg) : arg;
}

interface WhenCurry {
  <
    T,
    R,
    WF extends TFunc<[T], boolean> = TFunc<[T], boolean>,
    TF extends TFunc<[T], R> = TFunc<[T], R>,
  >(whenFunc: WF, thenFunc: TF): (arg: T) => R | T;
  <
    T,
    R,
    WF extends TFunc<[T], boolean> = TFunc<[T], boolean>,
    TF extends TFunc<[T], R> = TFunc<[T], R>,
  >(whenFunc: WF): (thenFunc: TF) => (arg: T) => R | T;
  <
    T,
    R,
    WF extends TFunc<[T], boolean> = TFunc<[T], boolean>,
    TF extends TFunc<[T], R> = TFunc<[T], R>,
  >(whenFunc: WF, thenFunc: TF, arg: T): R | T;
}

export const when = curry(when_) as any as WhenCurry;
