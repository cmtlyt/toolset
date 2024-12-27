import { describe, expect, it } from 'vitest';
import { arrayZip, ClArray } from '../../src';

describe('arrayZip', () => {
  it('默认情况下应使用最短模式压缩数组', () => {
    const result = arrayZip([[1, 2, 3], ['a', 'b', 'c']]);
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('应显式使用最短模式压缩数组', () => {
    const result = arrayZip([[1, 2, 3], ['a', 'b', 'c']], { mode: 'shortest' });
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('应使用最长模式和填充值压缩数组', () => {
    const result = arrayZip([[1, 2], ['a', 'b', 'c']], { mode: 'longest', padding: [null] });
    expect(result).toEqual([[1, 'a'], [2, 'b'], [null, 'c']]);
  });

  it('在严格模式下，如果长度不同，应抛出错误', () => {
    expect(() => {
      arrayZip([[1, 2], ['a', 'b', 'c']], { mode: 'strict' });
    }).toThrow(TypeError);
  });

  it('在严格模式下，如果长度相同，应压缩数组', () => {
    const result = arrayZip([[1, 2, 3], ['a', 'b', 'c']], { mode: 'strict' });
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('如果 iterables 不是一个对象，应抛出错误', () => {
    expect(() => {
      arrayZip(null as any);
    }).toThrow(TypeError);
  });

  it('如果 mode 无效，应抛出错误', () => {
    expect(() => {
      arrayZip([[1, 2, 3], ['a', 'b', 'c']], { mode: 'invalid' as any });
    }).toThrow(TypeError);
  });

  it('在最长模式下，如果 padding 不是一个对象，应抛出错误', () => {
    expect(() => {
      arrayZip([[1, 2], ['a', 'b', 'c']], { mode: 'longest', padding: 'invalid' as any });
    }).toThrow(TypeError);
  });

  it('应正确处理空数组', () => {
    const result = arrayZip([[], []]);
    expect(result).toEqual([]);
  });

  it('应正确处理单个数组', () => {
    const result = arrayZip([[1, 2, 3]]);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('应正确处理多个空数组', () => {
    const result = arrayZip([[], [], []]);
    expect(result).toEqual([]);
  });

  it('应正确处理不同长度的数组在最长模式下', () => {
    const result = arrayZip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'longest', padding: [null, null, null] });
    expect(result).toEqual([[1, 'a', true], [2, 'b', null], [null, 'c', null]]);
  });

  it('应正确处理不同长度的数组在最短模式下', () => {
    const result = arrayZip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'shortest' });
    expect(result).toEqual([[1, 'a', true]]);
  });

  it('应正确处理不同长度的数组在严格模式下', () => {
    expect(() => {
      arrayZip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'strict' });
    }).toThrow(TypeError);
  });

  it('应正确处理嵌套数组', () => {
    const result = arrayZip([[[1, 2]], [['a', 'b']], [[true, false]]]);
    expect(result).toEqual([[[1, 2], ['a', 'b'], [true, false]]]);
  });

  it('应正确处理不同类型的元素', () => {
    const result = arrayZip([[1, 'a', true], [2, 'b', false]]);
    expect(result).toEqual([[1, 2], ['a', 'b'], [true, false]]);
  });

  it('应正确处理迭代器', () => {
    function* gen1() {
      yield 1;
      yield 2;
      yield 3;
    }
    function* gen2() {
      yield 'a';
      yield 'b';
      yield 'c';
    }
    const result = arrayZip([gen1(), gen2()]);
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('longest 模式下传入错误 padding 应抛出类型错误', () => {
    const padding = { [Symbol.iterator]: () => '' };
    expect(() => {
      arrayZip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'longest', padding });
    }).toThrow(TypeError);
  });

  it('longest 模式下传入会报错的 padding 应直接透出该错误', () => {
    const padding = { [Symbol.iterator]: () => {
      throw new EvalError('123');
    } };
    expect(() => {
      arrayZip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'longest', padding });
    }).toThrow(EvalError);
  });

  it('longest 模式未传递 padding 配置, 应使用 undefined 填充', () => {
    const result = arrayZip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'longest' });
    expect(result).toEqual([[1, 'a', true], [2, 'b', undefined], [undefined, 'c', undefined]]);
  });
});

describe('use ClArray.zip', () => {
  it('默认情况下应使用最短模式压缩数组', () => {
    const result = ClArray.zip([[1, 2, 3], ['a', 'b', 'c']]);
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('应显式使用最短模式压缩数组', () => {
    const result = ClArray.zip([[1, 2, 3], ['a', 'b', 'c']], { mode: 'shortest' });
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('应使用最长模式和填充值压缩数组', () => {
    const result = ClArray.zip([[1, 2], ['a', 'b', 'c']], { mode: 'longest', padding: [null] });
    expect(result).toEqual([[1, 'a'], [2, 'b'], [null, 'c']]);
  });

  it('在严格模式下，如果长度不同，应抛出错误', () => {
    expect(() => {
      ClArray.zip([[1, 2], ['a', 'b', 'c']], { mode: 'strict' });
    }).toThrow(TypeError);
  });

  it('在严格模式下，如果长度相同，应压缩数组', () => {
    const result = ClArray.zip([[1, 2, 3], ['a', 'b', 'c']], { mode: 'strict' });
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('如果 iterables 不是一个对象，应抛出错误', () => {
    expect(() => {
      ClArray.zip(null as any);
    }).toThrow(TypeError);
  });

  it('如果 mode 无效，应抛出错误', () => {
    expect(() => {
      ClArray.zip([[1, 2, 3], ['a', 'b', 'c']], { mode: 'invalid' as any });
    }).toThrow(TypeError);
  });

  it('在最长模式下，如果 padding 不是一个对象，应抛出错误', () => {
    expect(() => {
      ClArray.zip([[1, 2], ['a', 'b', 'c']], { mode: 'longest', padding: 'invalid' as any });
    }).toThrow(TypeError);
  });

  it('应正确处理空数组', () => {
    const result = ClArray.zip([[], []]);
    expect(result).toEqual([]);
  });

  it('应正确处理单个数组', () => {
    const result = ClArray.zip([[1, 2, 3]]);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('应正确处理多个空数组', () => {
    const result = ClArray.zip([[], [], []]);
    expect(result).toEqual([]);
  });

  it('应正确处理不同长度的数组在最长模式下', () => {
    const result = ClArray.zip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'longest', padding: [null, null, null] });
    expect(result).toEqual([[1, 'a', true], [2, 'b', null], [null, 'c', null]]);
  });

  it('应正确处理不同长度的数组在最短模式下', () => {
    const result = ClArray.zip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'shortest' });
    expect(result).toEqual([[1, 'a', true]]);
  });

  it('应正确处理不同长度的数组在严格模式下', () => {
    expect(() => {
      ClArray.zip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'strict' });
    }).toThrow(TypeError);
  });

  it('应正确处理嵌套数组', () => {
    const result = ClArray.zip([[[1, 2]], [['a', 'b']], [[true, false]]]);
    expect(result).toEqual([[[1, 2], ['a', 'b'], [true, false]]]);
  });

  it('应正确处理不同类型的元素', () => {
    const result = ClArray.zip([[1, 'a', true], [2, 'b', false]]);
    expect(result).toEqual([[1, 2], ['a', 'b'], [true, false]]);
  });

  it('应正确处理迭代器', () => {
    function* gen1() {
      yield 1;
      yield 2;
      yield 3;
    }
    function* gen2() {
      yield 'a';
      yield 'b';
      yield 'c';
    }
    const result = ClArray.zip([gen1(), gen2()]);
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('longest 模式下传入错误 padding 应抛出类型错误', () => {
    const padding = { [Symbol.iterator]: () => '' };
    expect(() => {
      ClArray.zip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'longest', padding });
    }).toThrow(TypeError);
  });

  it('longest 模式下传入会报错的 padding 应直接透出该错误', () => {
    const padding = { [Symbol.iterator]: () => {
      throw new EvalError('123');
    } };
    expect(() => {
      ClArray.zip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'longest', padding });
    }).toThrow(EvalError);
  });

  it('longest 模式未传递 padding 配置, 应使用 undefined 填充', () => {
    const result = ClArray.zip([[1, 2], ['a', 'b', 'c'], [true]], { mode: 'longest' });
    expect(result).toEqual([[1, 'a', true], [2, 'b', undefined], [undefined, 'c', undefined]]);
  });
});
