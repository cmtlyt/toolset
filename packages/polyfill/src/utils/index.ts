import type { TAnyFunc, TObject } from '@cmtlyt/base';
import { getType, isConstructor } from '@cmtlyt/base';

export const IsConstructor = isConstructor;

/**
 * 创建一个数据属性，如果失败则抛出异常。
 *
 * @param {any} Object - 目标对象。
 * @param {string | symbol | number} P - 属性键。
 * @param {any} V - 属性值。
 * @throws {TypeError} 如果创建数据属性失败。
 */
export function CreateDataPropertyOrThrow(Object: any, P: string | symbol | number, V: any) {
  const success = CreateDataProperty(Object, P, V);
  if (!success)
    throw new TypeError('Failed to create data property on object');
}

/**
 * 创建一个数据属性。
 *
 * @param {TObject<any>} O - 目标对象。
 * @param {string | symbol | number} P - 属性键。
 * @param {any} V - 属性值。
 * @returns {boolean} 是否成功创建数据属性。
 */
export function CreateDataProperty(O: TObject<any>, P: string | symbol | number, V: any) {
  const newDesc = { value: V, writable: true, enumerable: true, configurable: true };
  return Object.defineProperty(O, P, newDesc);
}

interface GetIteratorResult {
  next: Iterator<any>['next'];
  return: Iterator<any>['return'];
  throw: Iterator<any>['throw'];
}

/**
 * 获取对象的迭代器。
 *
 * @param {any} obj - 目标对象。
 * @param {'SYNC' | 'ASYNC'} kind - 迭代器类型。
 * @returns {GetIteratorResult} 迭代器结果。
 * @throws {TypeError} 如果对象不可迭代。
 */
export function GetIterator(obj: any, kind: 'SYNC' | 'ASYNC'): GetIteratorResult {
  if (kind === 'ASYNC') {
    const method = GetMethod(obj, Symbol.asyncIterator);
    if (typeof method !== 'undefined') {
      return GetIteratorFromMethod(obj, method);
    }
    else {
      const syncMethod = GetMethod(obj, Symbol.iterator);
      if (typeof syncMethod === 'undefined') {
        throw new TypeError('Object is not iterable');
      }
      const syncIteratorRecord = GetIteratorFromMethod(obj, syncMethod);
      return CreateAsyncFromSyncIterator(syncIteratorRecord);
    }
  }
  else {
    const method = GetMethod(obj, Symbol.iterator);
    if (typeof method === 'undefined') {
      throw new TypeError('Object is not iterable');
    }
    return GetIteratorFromMethod(obj, method);
  }
}

/**
 * 创建一个异步迭代器，从同步迭代器转换而来。
 *
 * @param {any} syncIteratorRecord - 同步迭代器记录。
 * @returns {any} 异步迭代器。
 */
export function CreateAsyncFromSyncIterator(syncIteratorRecord: any): any {
  const AsyncFromSyncIteratorPrototype = {
    next() {
      // @ts-expect-error any
      const syncIteratorRecord = this.syncIteratorRecord;
      return new Promise((resolve) => {
        const result = syncIteratorRecord.next();
        resolve(result);
      });
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
  // 创建一个新的对象继承自模拟的异步迭代器原型

  const asyncIterator = Object.create(AsyncFromSyncIteratorPrototype);
  asyncIterator.syncIteratorRecord = syncIteratorRecord;

  // 构造并返回异步迭代器记录
  return {
    asyncIterator,
    next: asyncIterator.next.bind(asyncIterator),
    done: false,
  };
}

/**
 * 从方法获取迭代器。
 *
 * @param {any} obj - 目标对象。
 * @param {TAnyFunc} method - 方法。
 * @returns {GetIteratorResult} 迭代器结果。
 * @throws {TypeError} 如果提供的方法没有返回迭代器。
 */
export function GetIteratorFromMethod(obj: any, method: TAnyFunc) {
  const iterator = method.call(obj);
  if (!iterator || typeof iterator.next !== 'function') {
    throw new TypeError('Provided method did not return an iterator');
  }
  return {
    next: iterator.next.bind(iterator),
    return: iterator.return && iterator.return.bind(iterator),
    throw: iterator.throw && iterator.throw.bind(iterator),
  };
}

/**
 * 调用函数。
 *
 * @param {TAnyFunc} func - 函数。
 * @param {any} ctx - 上下文。
 * @param {any[]} [args] - 参数。
 * @returns {any} 函数调用结果。
 * @throws {TypeError} 如果函数不可调用。
 */
export function Call(func: TAnyFunc, ctx: any, args: any[] = []) {
  args ||= [];
  if (!IsCallable(func)) {
    throw new TypeError('Function is not callable');
  }
  return func.apply(ctx, args);
}

/**
 * 判断是否为可调用的函数。
 *
 * @param {any} func - 待判断的对象。
 * @returns {boolean} 是否为可调用的函数。
 */
export function IsCallable(func: any) {
  return typeof func === 'function';
}

/**
 * 获取对象的方法。
 *
 * @param {TObject<TAnyFunc>} obj - 目标对象。
 * @param {string | symbol | number} key - 方法键。
 * @returns {TAnyFunc | undefined} 方法。
 * @throws {TypeError} 如果属性不是函数。
 */
export function GetMethod(obj: TObject<TAnyFunc>, key: string | symbol | number) {
  const func = obj[key];
  if (typeof func === 'undefined' || func === null)
    return undefined;
  if (!IsCallable(func)) {
    throw new TypeError('Property is not a function');
  }
  return func;
}

/**
 * 获取选项对象。
 *
 * @param {any} [options] - 选项。
 * @returns {object} 选项对象。
 * @throws {TypeError} 如果选项不是对象。
 */
export function GetOptionsObject(options?: any) {
  if (typeof options === 'undefined')
    return Object.create(null);
  if (getType(options) === 'object')
    return options;
  throw new TypeError('options must be an object');
}

/**
 * 执行函数并捕获异常。
 *
 * @param {() => any} func - 函数。
 * @returns {any} 函数执行结果或异常。
 */
export function Completion(func: () => any): any {
  try {
    return func();
  }
  catch (error) {
    return error;
  }
}

/**
 * 关闭迭代器。
 *
 * @param {any} iteratorRecord - 迭代器记录。
 * @param {any} completion - 完成状态。
 * @returns {any} 完成状态。
 * @throws {TypeError} 如果迭代器结果不是对象。
 */
export function IteratorClose(iteratorRecord: any, completion: any): any {
  // 1. Assert: iteratorRecord.[[Iterator]] is an Object.
  // 2. Let iterator be iteratorRecord.[[Iterator]].
  const iterator = iteratorRecord.iterator;
  // 3. Let innerResult be Completion(GetMethod(iterator, "return")).
  let innerResult = Completion(() => GetMethod(iterator, 'return'));
  // 4. If innerResult is a normal completion, then
  if (innerResult !== undefined) {
    // a. Let return be innerResult.[[Value]].
    const returnMethod = innerResult;
    // b. If return is undefined, return ? completion.
    if (returnMethod === undefined) {
      return completion;
    }
    // c. Set innerResult to Completion(Call(return, iterator)).
    innerResult = Completion(() => Call(returnMethod, iterator));
  }
  // 5. If completion is a throw completion, return ? completion.
  if (completion instanceof Error) {
    return completion;
  }
  // 6. If innerResult is a throw completion, return ? innerResult.
  if (innerResult instanceof Error) {
    return innerResult;
  }
  // 7. If innerResult.[[Value]] is not an Object, throw a TypeError exception.
  if (typeof innerResult !== 'object') {
    throw new TypeError('Iterator result is not an object');
  }
  // 8. Return ? completion.
  return completion;
}

interface CompletionResult {
  type: 'normal' | 'throw' | 'return';
  value: any;
  target: any;
}

/**
 * 返回一个抛出异常的完成记录。
 *
 * @param {any} value - 异常值。
 * @returns {CompletionResult} 完成记录。
 */
export function ThrowCompletion(value: any): CompletionResult {
  return { type: 'throw', value, target: null };
}

/**
 * 返回一个返回值的完成记录。
 *
 * @param {any} value
 * @returns {CompletionResult} 完成记录。
 */
export function ReturnCompletion(value: any): CompletionResult {
  return { type: 'return', value, target: null };
}

/**
 * 组合多个迭代器的元素。
 *
 * @param {Array<Iterator<any>>} iterators - 要组合的迭代器。
 * @param {'shortest' | 'longest' | 'strict'} mode - 组合模式。
 * @param {Array<any>} padding - 在 mode 为 "longest" 时用于填充缺失的值。
 * @param {(results: any[]) => any[]} finishResults - 完成结果的闭包。
 * @returns {Iterator<any>} 组合后的迭代器。
 */
export function IteratorZip(iterators: Array<Iterator<any>>, mode: 'shortest' | 'longest' | 'strict', padding: Array<any>, finishResults: (results: any[]) => any[]): Iterator<any> {
  // 1. Let iterCount be the number of elements in iters.
  const iterCount = iterators.length;
  // 2. Let openIters be a copy of iters.
  const openIters = [...iterators];
  // 3. Let closure be a new Abstract Closure with no parameters that captures iters, iterCount, openIters, mode, padding, and finishResults, and performs the following steps when called:
  const closure = () => {
    // a. If iterCount = 0, return ReturnCompletion(undefined).
    if (iterCount === 0)
      return ReturnCompletion(undefined);

    // b. Repeat,
    // eslint-disable-next-line no-unreachable-loop
    while (true) {
      // i. Let results be a new empty List.
      const results = [];
      // ii. Assert: openIters is not empty.
      if (openIters.length === 0)
        throw new Error('openIters is empty');
      // iii. For each integer i such that 0 ≤ i < iterCount, in ascending order, do
      for (let i = 0; i < iterCount; i++) {
        // 1. Let iter be iters[i].
        const iter = iterators[i];
        let result;
        // 2. If iter is null, then
        if (iter === null) {
          // a. Assert: mode is "longest".
          if (mode !== 'longest')
            throw new Error('mode is not longest');
          // b. Let result be padding[i].
          result = padding[i];
        }
        else {
          // 3. Else,
          // a. Let result be Completion(IteratorStepValue(iter)).
          result = Completion(() => iter.next());
          // b. If result is an abrupt completion, then
          if (result instanceof Error) {
            // i. Remove iter from openIters.
            openIters.splice(openIters.indexOf(iter), 1);
            // ii. Return ? IteratorCloseAll(openIters, result).
            return IteratorCloseAll(openIters, result);
          }
          const resultDone = result.done;
          // c. Set result to ! result.
          result = result.value;
          // d. If result is done, then
          if (resultDone) {
            // i. Remove iter from openIters.
            openIters.splice(openIters.indexOf(iter), 1);
            // ii. If mode is "shortest", then
            if (mode === 'shortest') {
              // i. Return ? IteratorCloseAll(openIters, ReturnCompletion(undefined)).
              return IteratorCloseAll(openIters, ReturnCompletion(undefined));
            }
            else if (mode === 'strict') {
              // iii. Else if mode is "strict", then
              // i. If i ≠ 0, then
              if (i !== 0) {
                // i. Return ? IteratorCloseAll(openIters, ThrowCompletion(a newly created TypeError object)).
                return IteratorCloseAll(openIters, ThrowCompletion(new TypeError('Iterators have different lengths in strict mode')));
              }
              // ii. For each integer k such that 1 ≤ k < iterCount, in ascending order, do
              for (let k = 1; k < iterCount; k++) {
                // i. Assert: iters[k] is not null.
                if (iterators[k] === null)
                  throw new Error('iterators[k] is null');
                // ii. Let open be Completion(IteratorStep(iters[k])).
                const open = Completion(() => iterators[k].next());
                // iii. If open is an abrupt completion, then
                if (open instanceof Error) {
                  // i. Remove iters[k] from openIters.
                  openIters.splice(openIters.indexOf(iterators[k]), 1);
                  // ii. Return ? IteratorCloseAll(openIters, open).
                  return IteratorCloseAll(openIters, open);
                }
                // iv. Set open to ! open.
                // const openValue = open.value;
                // v. If open is done, then
                if (open.done) {
                  // i. Remove iters[k] from openIters.
                  openIters.splice(openIters.indexOf(iterators[k]), 1);
                }
                else {
                  // vi. Else,
                  // i. Return ? IteratorCloseAll(openIters, ThrowCompletion(a newly created TypeError object)).
                  return IteratorCloseAll(openIters, ThrowCompletion(new TypeError('Iterators have different lengths in strict mode')));
                }
              }
              // iii. Return ReturnCompletion(undefined).
              return ReturnCompletion(undefined);
            }
            else {
              // iv. Else,
              // i. Assert: mode is "longest".
              if (mode !== 'longest')
                throw new Error('mode is not longest');
              // ii. If openIters is empty, return ReturnCompletion(undefined).
              if (openIters.length === 0)
                return ReturnCompletion(undefined);
              // iii. Set iters[i] to null.
              // @ts-expect-error any
              iterators[i] = null;
              // iv. Set result to padding[i].
              result = padding[i];
            }
          }
        }
        // 4. Append result to results.
        results.push(result);
      }
      // iv. Set results to finishResults(results).
      const finalResults = finishResults(results);
      // v. Let completion be Completion(Yield(results)).
      const completion = Completion(() => Yield(finalResults));
      // vi. If completion is an abrupt completion, then
      if (completion instanceof Error) {
        // 1. Return ? IteratorCloseAll(openIters, completion).
        return IteratorCloseAll(openIters, completion);
      }
      return completion;
    }
  };

  // 4. Let gen be CreateIteratorFromClosure(closure, "Iterator Helper", %IteratorHelperPrototype%, « [[UnderlyingIterators]] »).
  const gen = {
    next: closure,
    [Symbol.iterator]() {
      return this;
    },
  };

  // 6. Return gen.
  return gen;
}

/**
 * 关闭所有迭代器。
 *
 * @param {Array<Iterator<any>>} iterators - 要关闭的迭代器。
 * @param {any} completion - 完成状态。
 * @returns {any} 完成状态。
 */
export function IteratorCloseAll(iterators: Array<Iterator<any>>, completion: any): any {
  for (const iterator of iterators) {
    try {
      IteratorClose({ iterator }, completion);
    }
    catch {
      // 忽略关闭迭代器时的错误
    }
  }
  return completion;
}

/**
 * 如果迭代器意外中断，则关闭所有迭代器。
 *
 * @param {any} abruptCompletion - 中断的完成状态。
 * @param {Array<Iterator<any>>} iterators - 要关闭的迭代器。
 * @throws {any} 中断的完成状态。
 */
export function IfAbruptCloseIterators(abruptCompletion: any, iterators: Array<Iterator<any>>) {
  if (abruptCompletion instanceof Error) {
    for (const iterator of iterators) {
      try {
        IteratorClose({ iterator }, abruptCompletion);
      }
      catch {
        // 忽略关闭迭代器时的错误
      }
    }
    throw abruptCompletion;
  }
}

/**
 * 从列表创建数组。
 *
 * @param {Array<any>} list - 要转换的列表。
 * @returns {Array<any>} 转换后的数组。
 */
export function CreateArrayFromList<T>(list: Array<T>): Array<T> {
  // 1. Let array be ! ArrayCreate(0).
  const array: T[] = [];
  // 2. Let n be 0.
  let n = 0;
  // 3. For each element e of elements, do
  for (const e of list) {
    // a. Perform ! CreateDataPropertyOrThrow(array, ! ToString(𝔽(n)), e).
    CreateDataPropertyOrThrow(array, n.toString(), e);
    // b. Set n to n + 1.
    n++;
  }
  // 4. Return array.
  return array;
}

/**
 * 获取生成器类型。
 *
 * @returns {'sync' | 'async'} 生成器类型。
 */
function GetGeneratorKind(): 'sync' | 'async' {
  // 这里假设我们有一个方法来获取当前生成器的类型
  // 实际实现中可能需要根据具体情况来确定
  return 'sync'; // 或 'async'
}

/**
 * 创建迭代器结果对象。
 *
 * @param {any} value - 迭代器结果的值。
 * @param {boolean} done - 迭代器是否完成。
 * @returns {IteratorResult<any>} 迭代器结果对象。
 */
function CreateIteratorResultObject(value: any, done: boolean): IteratorResult<any> {
  return { value, done };
}

/**
 * 异步生成器 yield。
 *
 * @param {any} value - 要 yield 的值。
 * @returns {Promise<IteratorResult<any>>} 异步迭代器结果。
 */
async function AsyncGeneratorYield(value: any): Promise<IteratorResult<any>> {
  const awaitedValue = await value;
  return CreateIteratorResultObject(awaitedValue, false);
}

/**
 * 生成器 yield。
 *
 * @param {any} value - 要 yield 的值。
 * @returns {IteratorResult<any> | Promise<IteratorResult<any>>} 迭代器结果。
 */
export function Yield(value: any): IteratorResult<any> | Promise<IteratorResult<any>> {
  // 1. Let generatorKind be GetGeneratorKind().
  const generatorKind = GetGeneratorKind();
  // 2. If generatorKind is async, return ? AsyncGeneratorYield(? Await(value)).
  if (generatorKind === 'async') {
    return AsyncGeneratorYield(value);
  }
  // 3. Otherwise, return ? GeneratorYield(CreateIteratorResultObject(value, false)).
  return CreateIteratorResultObject(value, false);
}
