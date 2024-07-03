export class Calculator {
  #_last: number;
  #_result: number;

  static group(func: (calc: Calculator) => void | Calculator | number, initValue = 0) {
    const calculator = new Calculator(initValue);
    const clientResult = func(calculator);
    return clientResult || calculator;
  }

  constructor(initValue = 0) {
    this.#_last = initValue;
    this.#_result = 0;
  }

  add(value: number) {
    this.#_result = this.#_result + this.#_last;
    this.#_last = value;
    return this;
  }
  sub(value: number) {
    this.#_result = this.#_result + this.#_last;
    this.#_last = -value;
    return this;
  }
  mut(value: number) {
    this.#_last *= value;
    return this;
  }
  div(value: number) {
    this.#_last /= value;
    return this;
  }
  getCurrValue() {
    return this.#_result + this.#_last;
  }
  valueOf() {
    this.#_last = this.#_result + this.#_last;
    this.#_result = 0;
    return this.#_last;
  }
}
