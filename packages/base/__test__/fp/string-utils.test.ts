import { describe, expect, inject, it } from 'vitest';

describe('string utils', async () => {
  const utils = await (() => {
    return inject('CI') ? import('../../dist/fp/utils') : import('../../src/fp/utils');
  })() as typeof import('../../src/fp/utils');

  it('toLowerCase', () => {
    const { toLowerCase } = utils;
    expect(toLowerCase('Hello World')).toBe('hello world');
    expect(toLowerCase('Hello World')).toBe('hello world');
    expect(toLowerCase('helloWorld')).toBe('helloworld');
  });
  it('toUpperCase', () => {
    const { toUpperCase } = utils;
    expect(toUpperCase('Hello World')).toBe('HELLO WORLD');
    expect(toUpperCase('Hello World')).toBe('HELLO WORLD');
    expect(toUpperCase('helloWorld')).toBe('HELLOWORLD');
  });
  it('toCamelCase', () => {
    const { toCamelCase } = utils;
    expect(toCamelCase('-webkit-transition')).toBe('WebkitTransition');
    expect(toCamelCase('webkit transition')).toBe('WebkitTransition');
    expect(toCamelCase('webkit-transition')).toBe('WebkitTransition');
    expect(toCamelCase('webkit - transition')).toBe('WebkitTransition');
  });
  it('toKebabCase', () => {
    const { toKebabCase } = utils;
    expect(toKebabCase('-webkit-transition')).toBe('webkit-transition');
    expect(toKebabCase('webkit transition')).toBe('webkit-transition');
    expect(toKebabCase('webkit-transition')).toBe('webkit-transition');
    expect(toKebabCase('webkit-Transition')).toBe('webkit-transition');
    expect(toKebabCase('Webkit-Transition')).toBe('webkit-transition');
    expect(toKebabCase('webkit - transition')).toBe('webkit-transition');
  });
  it('toUnderlineCase', () => {
    const { toUnderlineCase } = utils;
    expect(toUnderlineCase('-webkit-transition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkit transition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkit-transition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkit - transition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkitTransition')).toBe('webkit_transition');
    expect(toUnderlineCase('webkit-Transition')).toBe('webkit_transition');
  });
});
