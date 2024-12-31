import { compose } from '$/utils';
import { Functor, type GetFunctorResult } from './utils';

class IO<T extends (...args: any[]) => any> extends Functor<T> {
  name = 'IO';

  map<R>(fn: (value: ReturnType<T>) => R): IO<(...args: Parameters<T>) => R> {
    return io(compose(fn, this.valueOf() as any));
  }

  flatMap<C extends Functor<any>, R = GetFunctorResult<C>>(fn: (value: ReturnType<T>) => C): IO<(...args: Parameters<T>) => R> {
    return io(compose((v: any) => fn(v).valueOf(), this.valueOf() as any));
  }

  run(...args: Parameters<T>): ReturnType<T> {
    return this.valueOf()(...args);
  }
}

export function io<T extends (...args: any[]) => any>(value: T) {
  return new IO(value);
}
