import { Functor } from './utils';

class Container<T> extends Functor<T> {
  name = 'Container';

  map<R>(fn: (value: T) => R) {
    return container(fn(this.valueOf()));
  }

  flatMap<R>(fn: (value: T) => Container<R>) {
    return container(fn(this.valueOf()).valueOf());
  }
}

export function container<T>(value: T) {
  return new Container(value);
}
