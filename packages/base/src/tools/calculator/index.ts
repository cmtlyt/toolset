import { isNumber } from '@/utils';

export class Calculator {
  #_last: number;
  #_result: number;

  static group(func: (calc: Calculator) => void | Calculator | number, initValue = 0) {
    if (typeof func !== 'function') {
      throw new TypeError('func 必须是一个函数');
    }
    const calculator = new Calculator(initValue);
    const clientResult = func(calculator);
    return clientResult ?? calculator;
  }

  constructor(initValue = 0) {
    this.#_last = initValue;
    this.#_result = 0;
  }

  #_getValue(value: number | Calculator) {
    if (value instanceof Calculator) {
      return value.getCurrValue();
    } else if (isNumber(value)) {
      return value;
    } else {
      throw new TypeError('value 必须是一个数字或 Calculator');
    }
  }

  add(value: number | Calculator) {
    value = this.#_getValue(value);
    this.#_result = this.#_result + this.#_last;
    this.#_last = value;
    return this;
  }
  sub(value: number | Calculator) {
    value = this.#_getValue(value);
    this.#_result = this.#_result + this.#_last;
    this.#_last = -value;
    return this;
  }
  mut(value: number | Calculator) {
    value = this.#_getValue(value);
    this.#_last *= value;
    return this;
  }
  div(value: number | Calculator) {
    value = this.#_getValue(value);
    this.#_last /= value;
    return this;
  }
  getCurrValue() {
    return this.#_result + this.#_last;
  }
  valueOf() {
    this.#_last = this.getCurrValue();
    this.#_result = 0;
    return this.#_last;
  }
}
