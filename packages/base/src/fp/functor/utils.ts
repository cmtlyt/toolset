export type GetFunctorResult<T, F = unknown> = T extends Functor<infer R> ? R : F;

const stateMap = new WeakMap<object, any>();

export function getState<R = any>(instance: object): R {
  return stateMap.get(instance);
}

export function setState(instance: object, state: any) {
  stateMap.set(instance, state);
}

export function getMap() {
  return stateMap;
}

export abstract class Functor<T> {
  abstract name: string;

  constructor(value: T) {
    setState(this, { value });
  }

  abstract map(_fn: (value: any) => any): any;

  abstract flatMap(_fn: (value: any) => any): any;

  valueOf(): T {
    return getState(this).value;
  }

  inspect() {
    return `${this.name}{ ${this.valueOf()} }`;
  }

  join = this.valueOf;
}
