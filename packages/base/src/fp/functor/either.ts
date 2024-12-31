import { Functor, type GetFunctorResult } from './utils';

class Right<T> extends Functor<T> {
  name = 'Right';

  map <R>(fn: (value: T) => R): Right<R> {
    return right(fn(this.valueOf()));
  };

  flatMap<R>(fn: (value: T) => Functor<R>): Right<R> {
    return right(fn(this.valueOf()).valueOf());
  }
}

export function right<T>(value: T) {
  return new Right(value);
}

class Left<T> extends Functor<T> {
  name = 'Left';

  map(_fn: (value: T) => any): Left<T> {
    return this;
  }

  flatMap(_fn: (value: T) => Functor<any>): Left<T> {
    return this;
  }
}

export function left<T>(value: T) {
  return new Left(value);
}

class Either<T> extends Functor<T> {
  name = 'Either';

  map<R>(fn: (value: T) => R): Either<R> | Left<any> {
    try {
      return either(fn(this.valueOf()));
    }
    catch (err) {
      return left(err);
    }
  }

  flatMap<C extends Functor<any>, R = GetFunctorResult<C>>(fn: (value: T) => C): Either<R> | Left<any> {
    try {
      return either(fn(this.valueOf()).valueOf());
    }
    catch (err) {
      return left(err);
    }
  }
}

export function either<T>(value: T) {
  return new Either(value);
}
