import { Functor, type GetFunctorResult } from './utils';

class IO<T extends (...args: any[]) => any> extends Functor<T> {
  name = 'IO';

  map<R>(fn: (value: ReturnType<T>) => R): IO<(...args: Parameters<T>) => R> {
    return io((...args: any[]) => fn(this.valueOf()(...args)));
  }

  flatMap<C extends Functor<any>, R = GetFunctorResult<C>>(fn: (value: ReturnType<T>) => C): IO<(...args: Parameters<T>) => R> {
    return io((...args: any[]) => fn(this.valueOf()(...args)).valueOf());
  }

  run(...args: Parameters<T>): ReturnType<T> {
    return this.valueOf()(...args);
  }
}

export function io<T extends (...args: any[]) => any>(value: T) {
  return new IO(value);
}
