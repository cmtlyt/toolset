import { Functor, type GetFunctorResult } from './utils';

export class MayBe<T> extends Functor<T> {
  name = 'Maybe';

  isNothing(): boolean {
    return typeof this.valueOf() === 'undefined' || this.valueOf() === null;
  }

  map<R>(fn: (value: T) => R): MayBe<R | null> {
    return this.isNothing() ? maybe(null) : maybe(fn(this.valueOf()!));
  }

  flatMap <C extends Functor<any>, R = GetFunctorResult<C>>(fn: (value: T) => C): MayBe<R | null> {
    return this.isNothing() ? maybe(null) : maybe(fn(this.valueOf()!).valueOf());
  };
}

export function maybe<T>(value: T) {
  return new MayBe(value);
}
