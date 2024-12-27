import { describe, expect, it } from 'vitest';
import * as utils from '../../src/utils/index';

describe('utils', () => {
  it('应该创建数据属性或抛出异常', () => {
    const obj = {};
    utils.CreateDataPropertyOrThrow(obj, 'key', 'value');
    expect(obj).toHaveProperty('key', 'value');
  });

  it('应该获取迭代器', () => {
    const array = [1, 2, 3];
    const iterator = utils.GetIterator(array, 'SYNC');
    expect(iterator.next().value).toBe(1);
  });

  it('应该调用函数', () => {
    const func = (a: number, b: number) => a + b;
    const result = utils.Call(func, null, [1, 2]);
    expect(result).toBe(3);
  });

  it('应该检查函数是否可调用', () => {
    const func = () => {};
    const result = utils.IsCallable(func);
    expect(result).toBe(true);
  });

  it('应该从对象中获取方法', () => {
    const obj = {
      method: () => 'test',
    };
    const method = utils.GetMethod(obj, 'method')!;
    expect(method()).toBe('test');
  });

  it('应该获取选项对象', () => {
    const options = utils.GetOptionsObject({ key: 'value' });
    expect(options).toHaveProperty('key', 'value');
  });

  it('应该完成函数执行', () => {
    const func = () => 'result';
    const result = utils.Completion(func);
    expect(result).toBe('result');
  });

  it('应该抛出类型错误', () => {
    const iterator = [1, 2, 3][Symbol.iterator]();
    const func = () => utils.IteratorClose({ iterator }, 'completion');
    expect(() => func()).toThrow(TypeError);
  });

  it('应该从列表创建数组', () => {
    const list = [1, 2, 3];
    const array = utils.CreateArrayFromList(list);
    expect(array).toEqual(list);
  });

  it('应该yield值', async () => {
    const result = await utils.Yield('value');
    expect(result).toEqual({ value: 'value', done: false });
  });

  // 新增测试用例
  it('应该抛出对象不可迭代的错误', () => {
    const nonIterable = {};
    expect(() => utils.GetIterator(nonIterable, 'SYNC')).toThrow(TypeError);
  });

  it('应该返回异步迭代器', async () => {
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    };
    const iterator = utils.GetIterator(asyncIterable, 'ASYNC');
    const result = await iterator.next();
    expect(result.value).toBe(1);
  });

  it('应该返回默认选项对象', () => {
    const options = utils.GetOptionsObject();
    expect(options).toEqual({});
  });

  it('应该抛出选项必须是对象的错误', () => {
    expect(() => utils.GetOptionsObject('not an object')).toThrow(TypeError);
  });

  it('应该返回正常完成记录', () => {
    const result = utils.Completion(() => 'success');
    expect(result).toBe('success');
  });

  it('应该返回异常完成记录', () => {
    const error = new Error('failure');
    const result = utils.Completion(() => {
      throw error;
    });
    expect(result).toBe(error);
  });

  it('应该关闭所有迭代器', () => {
    const iterator1 = [1, 2, 3][Symbol.iterator]();
    const iterator2 = [4, 5, 6][Symbol.iterator]();
    const result = utils.IteratorCloseAll([iterator1, iterator2], 'completion');
    expect(result).toBe('completion');
  });

  it('应该抛出迭代器长度不一致的错误', () => {
    const iterator1 = [1, 2, 3][Symbol.iterator]();
    const iterator2 = [4, 5][Symbol.iterator]();
    const iterator = utils.IteratorZip([iterator1, iterator2], 'strict', [], results => results);
    expect(JSON.stringify(iterator.next())).toMatchInlineSnapshot(`"{"value":[1,4],"done":false}"`);
    expect(JSON.stringify(iterator.next())).toMatchInlineSnapshot(`"{"value":[2,5],"done":false}"`);
    const result = iterator.next();
    expect(JSON.stringify(result)).toMatchInlineSnapshot(`"{"type":"throw","value":{},"target":null}"`);
    expect(result.value).toBeInstanceOf(TypeError);
    expect(result.value.message).toMatchInlineSnapshot(`"Iterators have different lengths in strict mode"`);
  });

  it('应该组合多个迭代器的元素', () => {
    const iterator1 = [1, 2, 3][Symbol.iterator]();
    const iterator2 = ['a', 'b', 'c'][Symbol.iterator]();
    const zipIterator = utils.IteratorZip([iterator1, iterator2], 'shortest', [], results => results);
    const result = zipIterator.next();
    expect(result.value).toEqual([1, 'a']);
  });

  // 新增测试用例
  it('应该抛出属性不是函数的错误', () => {
    const obj: Record<string, any> = {
      method: 'not a function',
    };
    expect(() => utils.GetMethod(obj, 'method')).toThrow(TypeError);
  });

  it('应该返回undefined当方法不存在时', () => {
    const obj = {};
    const method = utils.GetMethod(obj, 'nonExistentMethod');
    expect(method).toBeUndefined();
  });

  it('应该正确处理异步生成器yield', async () => {
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    };
    const iterator = utils.GetIterator(asyncIterable, 'ASYNC');
    const result1 = await iterator.next();
    const result2 = await iterator.next();
    const result3 = await iterator.next();
    expect(result1.value).toBe(1);
    expect(result2.value).toBe(2);
    expect(result3.value).toBe(3);
  });

  it('应该正确处理同步生成器yield', () => {
    const iterable = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    };
    const iterator = utils.GetIterator(iterable, 'SYNC');
    const result1 = iterator.next();
    const result2 = iterator.next();
    const result3 = iterator.next();
    expect(result1.value).toBe(1);
    expect(result2.value).toBe(2);
    expect(result3.value).toBe(3);
  });

  it('应该正确处理异步生成器完成', async () => {
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    };
    const iterator = utils.GetIterator(asyncIterable, 'ASYNC');
    await iterator.next();
    await iterator.next();
    await iterator.next();
    const result = await iterator.next();
    expect(result.done).toBe(true);
  });

  it('应该正确处理同步生成器完成', () => {
    const iterable = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    };
    const iterator = utils.GetIterator(iterable, 'SYNC');
    iterator.next();
    iterator.next();
    iterator.next();
    const result = iterator.next();
    expect(result.done).toBe(true);
  });

  it('应该正确处理异步生成器异常', async () => {
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        throw new Error('test error');
      },
    };
    const iterator = utils.GetIterator(asyncIterable, 'ASYNC');
    await iterator.next();
    await expect(iterator.next()).rejects.toThrow('test error');
  });

  it('应该正确处理同步生成器异常', () => {
    const iterable = {
      *[Symbol.iterator]() {
        yield 1;
        throw new Error('test error');
      },
    };
    const iterator = utils.GetIterator(iterable, 'SYNC');
    iterator.next();
    expect(() => iterator.next()).toThrow('test error');
  });

  it('当异步迭代器不存在时应该返回同步迭代器并使用异步的方式调用', async () => {
    const iterable = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    };
    const iterator = utils.GetIterator(iterable, 'ASYNC');
    const result1 = await iterator.next();
    const result2 = await iterator.next();
    const result3 = await iterator.next();
    expect(result1.value).toBe(1);
    expect(result2.value).toBe(2);
    expect(result3.value).toBe(3);
  });

  it('获取异步迭代器时, 异步迭代器和同步迭代器都不存在时应该报错', async () => {
    const iterable = { };
    const func = () => utils.GetIterator(iterable, 'ASYNC');
    expect(() => func()).toThrow(TypeError);
  });
});
