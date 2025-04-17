import { describe, expect, inject, it } from 'vitest';

describe('createOverloadFunc', async () => {
  const { createOverloadFunc, typesMatch } = await (() => {
    // @ts-expect-error any
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

  const add = createOverloadFunc<{
    (): void;
    (a: number, b: number): string;
    (a: string, b: string): string;
    (a: string, b: number): string;
    (a: number, b: string): string;
    (...args: number[]): string;
    (args: number[]): string;
    (a: any, b: string): string;
    (a: number, b: unknown): string;
    (a: any, b: object): string;
  }>();

  it('get add instance prop', async () => {
    expect(add.toString()).toMatchInlineSnapshot(`"[object Function]"`);
  });

  it('register impl', async () => {
    expect(
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      add.register((a, b) => `nns: ${a + b}`, 'number', 'number', 'string')
        .register((a, b) => `sss: ${Number(a) + Number(b)}`, 'string', 'string', 'string')
        .register((a, b) => `sss: ${a + b}`, args => args[0].length > 5 || args[1].length > 5, 'string', 'string', 'string')
        .register((a, b) => `sns: ${Number(a) + b}`, 'string', 'number', 'string')
        .register((a, b) => `nss: ${a + Number(b)}`, 'number', 'string', 'string')
        .register(() => {}, 'void')
        .register((...args) => args.reduce((pre, cur) => pre + cur, '...args: '), '...number', 'string')
        .register(args => args.reduce((pre, cur) => pre + cur, 'args[]: '), 'number[]', 'string')
        .register((a, b) => `a: ${a}, b: ${b}`, 'any', 'string', 'string')
        .register((a, b) => `a: ${a}, b: ${b}`, 'number', 'unknown', 'string')
        .register((_a, _b) => '', () => false, 'any', 'object', 'string'),
    ).toBe(add);
    // @ts-expect-error any
    expect(() => add.register('test')).toThrowErrorMatchingInlineSnapshot(`[TypeError: 第一个参数必须为 function 类型，或者为可识别的 配置项 类型]`);
    // @ts-expect-error any
    expect(() => add.register(() => {}, () => {}, () => {})).toThrowErrorMatchingInlineSnapshot(`[TypeError: 剩余参数必须为 string 类型]`);
    expect(() => add.register((_a, _b) => ``, 'number', 'unknown', 'string')).toThrowErrorMatchingInlineSnapshot(`[TypeError: 当前多态已实现, 类型: number,any]`);
  });

  it('typesMatch', async () => {
    expect(typesMatch(['...number'], ['number', 'number', 'number', 'number'])).toBeTruthy();
  });

  it('call impl', async () => {
    expect(add(1, 2)).toBe('nns: 3');
    expect(add('1', '2')).toBe('sss: 3');
    expect(add('123', '456')).toBe('sss: 579');
    expect(add('123456', '789')).toBe('sss: 123456789');
    expect(add('123', 456)).toBe('sns: 579');
    expect(add(123, '456')).toBe('nss: 579');
    expect(add(1, 2, 3, 4)).toBe('...args: 1234');
    expect(add([1, 2, 3, 4])).toBe('args[]: 1234');
    expect(add(true, '456')).toBe('a: true, b: 456');
    expect(add(123, true)).toBe('a: 123, b: true');
    expect(add()).toBe(undefined);
    // @ts-expect-error any
    expect(() => add(true, true)).toThrowErrorMatchingInlineSnapshot(`[TypeError: 没有找到匹配的函数]`);
    expect(() => add(true, { a: 1 })).toThrowErrorMatchingInlineSnapshot(`[TypeError: 没有找到匹配的函数]`);
  });

  it('promise impl', async () => {
    const test = createOverloadFunc<{
      (): Promise<string>;
      (a: Promise<number>): number;
      (a: Promise<string>): string;
      (...args: Promise<boolean>[]): Promise<boolean>;
    }>();

    test.register(async () => '', 'promise<string>');
    test.register(_a => 1, 'promise<number>', 'number');
    test.register(_a => '1', 'promise<string>', 'string');
    test.register(async (..._a) => true as boolean, '...promise<boolean>', 'promise<boolean>');

    expect(await test()).toBe('');
    expect(test(Promise.resolve(1))).toBe(1);
    expect(test(Promise.resolve('1'))).toBe(1);
    expect(await test(Promise.resolve(true), Promise.resolve(false))).toBe(true);
  });
});
