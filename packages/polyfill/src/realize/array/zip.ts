// 1. If iterables is not an Object, throw a TypeError exception。
// 2. Set options to ? GetOptionsObject(options)。
// 3. Let mode be ? Get(options, "mode")。
// 4. If mode is undefined, set mode to "shortest"。
// 5. If mode is not one of "shortest", "longest", or "strict", throw a TypeError exception。
// 6. Let paddingOption be undefined。
// 7. If mode is "longest", then
//    a. Set paddingOption to ? Get(options, "padding")。
//    b. If paddingOption is not undefined and paddingOption is not an Object, throw a TypeError exception。
// 8. Let iters be a new empty List。
// 9. Let padding be a new empty List。
// 10. Let inputIter be ? GetIterator(iterables, sync)。
// 11. Let next be not-started。
// 12. Repeat, while next is not done，
//     a. Set next to Completion(IteratorStepValue(inputIter))。
//     b. IfAbruptCloseIterators(next, iters)。
//     c. If next is not done, then
//        i. Let iter be Completion(GetIteratorFlattenable(next, reject-strings))。
//        ii. IfAbruptCloseIterators(iter, the list-concatenation of « inputIter » and iters)。
//        iii. Append iter to iters。
// 13. Let iterCount be the number of elements in iters。
// 14. If mode is "longest", then
//     a. If paddingOption is undefined, then
//        i. Perform the following steps iterCount times：
//           1. Append undefined to padding。
//     b. Else，
//        i. Let paddingIter be Completion(GetIterator(paddingOption, sync))。
//        ii. IfAbruptCloseIterators(paddingIter, iters)。
//        iii. If paddingIter is a String, throw a TypeError exception。
//        iv. Let usingIterator be true。
//        v. Perform the following steps iterCount times：
//           1. If usingIterator is true, then
//              a. Set next to Completion(IteratorStepValue(paddingIter))。
//              b. IfAbruptCloseIterators(next, iters)。
//              c. If next is done, then
//                 i. Set usingIterator to false。
//              d. Else，
//                 i. Append next to padding。
//           2. If usingIterator is false, append undefined to padding。
//        vi. If usingIterator is true, then
//            1. Let completion be Completion(IteratorClose(paddingIter, ReturnCompletion(undefined)))。
//            2. IfAbruptCloseIterators(completion, iters)。
// 15. Let finishResults be a new Abstract Closure with parameters (results) that captures nothing and performs the following steps when called：
//     a. Return CreateArrayFromList(results)。
// 16. Let gen be IteratorZip(iters, mode, padding, finishResults)。
// 17. Let items be a new empty List。
// 18. Repeat，
//     a. Let value be ? IteratorStepValue(gen)。
//     b. If value is done, return CreateArrayFromList(items)。
//     c. Append value to items。

import { Completion, CreateArrayFromList, GetIterator, GetOptionsObject, IfAbruptCloseIterators, IteratorZip } from '$/utils';

// options 配置
export interface ZipOptions {
  mode?: 'shortest' | 'longest' | 'strict';
  padding?: any; // padding 用于在 mode 为 "longest" 时填充缺失的值
}

/**
 * 将多个可迭代对象的元素组合成一个新的数组
 *
 * @param {Iterable<any>[]} iterables - 要组合的可迭代对象
 * @param {ZipOptions} [options] - 配置选项
 * @param {'shortest' | 'longest' | 'strict'} [options.mode] - 组合模式
 * @param {any} [options.padding] - 在 mode 为 "longest" 时用于填充缺失的值
 * @returns {Array<any>} 组合后的数组
 *
 * @throws {TypeError} 如果 iterables 不是一个对象，或 mode 无效，或 paddingOption 无效
 */
export function arrayZip(iterables: Iterable<any>[], options?: ZipOptions): Array<any> {
  // 如果传入的 iterables 不是对象的话直接抛出错误
  if (typeof iterables !== 'object') {
    throw new TypeError('iterables is not an Object');
  }
  // 获取安全的 options
  const _options = GetOptionsObject(options);
  let mode: ZipOptions['mode'] = _options.mode;
  // 设置 mode 默认值
  if (typeof mode === 'undefined') {
    mode = 'shortest';
  }
  // 如果 mode 不是规定的配置则直接报错
  if (mode !== 'shortest' && mode !== 'longest' && mode !== 'strict') {
    throw new TypeError('mode is not one of "shortest", "longest", or "strict"');
  }
  let paddingOption: any;
  // 如果 mode 为 "longest" 则获取 paddingOption
  if (mode === 'longest') {
    paddingOption = _options.padding;
    // 判断 padding 是否合法
    if (typeof paddingOption !== 'undefined' && typeof paddingOption !== 'object') {
      throw new TypeError('padding is not an Object');
    }
  }
  // 存储所有可迭代对象的迭代器
  const iters: Iterator<any>[] = [];
  // 存储在 mode 为 "longest" 时用于填充缺失的值
  const padding: any[] = [];
  // 存储输入的可迭代对象的迭代器
  const inputIter = GetIterator(iterables, 'SYNC');
  // 初始化 next 为 not-started
  let next: IteratorResult<any> = { value: undefined, done: false };
  // 一直重复直到结束
  while (!next.done) {
    // 拿到第一个可迭代对象
    next = Completion(() => inputIter.next());
    // 如果操作意外中断则关闭所有迭代器, 并退出
    IfAbruptCloseIterators(next, iters);
    if (next.done)
      break;
    // 获取可迭代对象的迭代器
    const iter = Completion(() => GetIterator(next.value, 'SYNC'));
    // 如果操作意外中断则关闭所有迭代器
    IfAbruptCloseIterators(iter, [inputIter, ...iters]);
    iters.push(iter);
  }
  // 存储迭代器的数量
  const iterCount = iters.length;
  // 如果是 "longest" 模式, 处理 padding 值
  if (mode === 'longest') {
    // 设置 paddingOption 的默认值
    if (paddingOption === undefined) {
      for (let i = 0; i < iterCount; i++) {
        padding.push(undefined);
      }
    }
    else {
      const paddingIter = Completion(() => GetIterator(paddingOption, 'SYNC'));
      // 如果操作中断则关闭所有迭代器
      IfAbruptCloseIterators(paddingIter, iters);
      if (typeof paddingIter === 'string') {
        throw new TypeError('paddingIter is a String');
      }
      // 是否使用 padding 迭代器的值, 人话说就是, 长度小于输入的可迭代对象
      let usingIterator = true;
      // 填充 padding 让他的长度和传入的可迭代对象一样
      for (let i = 0; i < iterCount; i++) {
        if (usingIterator) {
          // 以安全的方式获取下一个值
          next = Completion(() => paddingIter.next());
          // 如果操作中断则关闭所有迭代器
          IfAbruptCloseIterators(next, iters);
          if (next.done) {
            usingIterator = false;
          }
          else {
            padding.push(next.value);
          }
        }
        if (!usingIterator) {
          padding.push(undefined);
        }
      }
    }
  }
  const finishResults = (results: any[]) => {
    return CreateArrayFromList(results);
  };
  // 返回一个迭代器, 用于组合多个迭代器的元素
  const gen = IteratorZip(iters, mode, padding, finishResults);
  const items: any[] = [];
  while (true) {
    const value = Completion(() => gen.next());
    // 添加退出条件，避免死循环
    if (value.done || value.type === 'return') {
      return CreateArrayFromList(items);
    }
    else if (value.type === 'throw') {
      throw value.value;
    }
    else if (value instanceof Error) {
      throw value;
    }
    items.push(value.value);
  }
}
