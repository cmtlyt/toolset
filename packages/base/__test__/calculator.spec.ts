/* eslint-disable ts/ban-ts-comment */
// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { Calculator } from '../src/tools/calculator';

describe('calculator', () => {
  const calc = new Calculator();

  it('add', () => {
    expect(calc.add(1).getCurrValue()).toBe(1);
    expect(calc.add(new Calculator(1)).getCurrValue()).toBe(2);
    expect(() => calc.add(null)).toThrowErrorMatchingInlineSnapshot(`[TypeError: value 必须是一个数字或 Calculator]`);
  });

  it('sub', () => {
    expect(calc.sub(1).getCurrValue()).toBe(1);
    expect(calc.sub(new Calculator(1)).getCurrValue()).toBe(0);
    expect(() => calc.sub(null)).toThrowErrorMatchingInlineSnapshot(`[TypeError: value 必须是一个数字或 Calculator]`);
  });

  it('mut', () => {
    calc.add(5);
    expect(calc.mut(2).getCurrValue()).toBe(10);
    expect(calc.mut(new Calculator(2)).getCurrValue()).toBe(20);
    expect(() => calc.mut(null)).toThrowErrorMatchingInlineSnapshot(`[TypeError: value 必须是一个数字或 Calculator]`);
  });

  it('div', () => {
    expect(calc.div(2).getCurrValue()).toBe(10);
    expect(calc.div(new Calculator(2)).getCurrValue()).toBe(5);
    expect(() => calc.div(null)).toThrowErrorMatchingInlineSnapshot(`[TypeError: value 必须是一个数字或 Calculator]`);
  });

  it('group', () => {
    expect(
      calc
        .add(
          Calculator.group((calc) => {
            calc.add(1);
            calc.mut(5);
            calc.sub(new Calculator(2));
          }),
        )
        .getCurrValue(),
    ).toBe(8);
    expect(
      calc
        .sub(
          Calculator.group((calc) => {
            calc.add(1);
            calc.mut(5);
            calc.sub(new Calculator(2));
            return calc;
          }),
        )
        .getCurrValue(),
    ).toBe(5);
    expect(
      calc
        .mut(
          Calculator.group((calc) => {
            calc.add(1);
            calc.mut(5);
            calc.sub(new Calculator(2));
            return 2;
          }),
        )
        .getCurrValue(),
    ).toBe(2);
    expect(() => Calculator.group(null)).toThrowErrorMatchingInlineSnapshot(`[TypeError: func 必须是一个函数]`);
  });

  it('result', () => {
    expect(calc.valueOf()).toBe(2);
    expect(+calc).toBe(2);
    expect(calc.getCurrValue()).toBe(2);
    calc.add(2);
    expect(calc.valueOf()).toBe(4);
    calc.mut(2);
    expect(calc.valueOf()).toBe(8);
    calc.sub(2);
    expect(calc.getCurrValue()).toBe(6);
    calc.mut(2);
    expect(calc.valueOf()).toBe(4);
    calc.div(2);
    expect(calc.getCurrValue()).toBe(2);
  });
});
