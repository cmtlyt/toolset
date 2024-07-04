# 函数处理相关方法

## cacheByReturn

缓存函数返回值

**类型声明**

```ts
type TAnyFunc = (...args: any[]) => any;
type TCacheByReturnType<F extends () => any, R = ReturnType<F>> = R extends TAnyFunc ? R : () => R;

function cacheByReturn<F extends () => any>(cacheLoad: F): TCacheByReturnType<F>;
```

**参数**

| 必填 | 参数      | 说明         | 类型 | 默认值 |
| :--: | --------- | ------------ | ---- | ------ |
|  \*  | cacheLoad | 缓存加载函数 | F    | -      |

**返回值**: `TCacheByReturnType<F>`

**示例**

```ts
import { cacheByReturn } from '@cmtlyt/base';
// import { cacheByReturn } from '@cmtlyt/base/utils/funcHandler';

const cacheLoad = () => {
  console.log('cacheLoad');
  return 'hello world';
};
const cachedLoad = cacheByReturn(cacheLoad);
console.log(cachedLoad()); // cacheLoad \n hello world
console.log(cachedLoad()); // hello world
```

## memoize

缓存函数

**类型声明**

```ts
function memoize<F extends TAnyFunc>(func: F, resolver?: (...args: TArgsType<F>) => any): F;
```

**参数**

| 必填 | 参数     | 说明         | 类型 | 默认值 |
| :--: | -------- | ------------ | ---- | ------ |
|  \*  | func     | 缓存加载函数 | F    | -      |
|      | resolver | 缓存解析函数 | F    | -      |

**返回值**: `F`

**示例**

```ts
import { memoize } from '@cmtlyt/base';
// import { memoize } from '@cmtlyt/base/utils/funcHandler';

const fn = (a: number, b: number) => {
  console.log('fn');
  return a + b;
};
const memoizedFn = memoize(fn);
memoizedFn(1, 2); // fn \n 3
memoizedFn(1, 2); // 3
memoizedFn(1, 2); // 3
memoizedFn(2, 2); // fn \n 4
memoizedFn(2, 2); // 4
memoizedFn(1, 3); // fn \n 4
memoizedFn(1, 3); // 4
```

## curry

将普通函数转换为柯里化函数

> 不放类型声明了，太过复杂

**参数**

| 必填 | 参数名 | 类型     | 说明           | 默认值 |
| :--: | ------ | -------- | -------------- | ------ |
|  \*  | fn     | TAnyFunc | 需要转换的函数 | -      |

**返回值**: 柯里化后的函数

**示例**

```ts
import { curry } from '@cmtlyt/base';
// import { curry } from '@cmtlyt/base/utils/funcHandler';

const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);
curriedAdd(1)(2); // 3
curriedAdd(1, 2); // 3
```

## compose

组合函数，从右到左执行

> 不放类型声明了，太过复杂

**参数**

| 必填 | 参数名 | 类型       | 说明           | 默认值 |
| :--: | ------ | ---------- | -------------- | ------ |
|  \*  | funcs  | TAnyFunc[] | 需要组合的函数 | -      |

**返回值**: 组合后的函数

**示例**

```ts
import { compose, curry } from '@cmtlyt/base';
// import { compose, curry } from '@cmtlyt/base/utils/funcHandler';

const add = curry((a: number, b: number) => a + b);
const multiply = curry((a: number, b: number) => a * b);
const addAndMultiply = compose(multiply(2), add);
addAndMultiply(1, 2); // 6
```

## pipe

组合函数，从左到右执行

> 不放类型声明了，太过复杂

**参数**

| 必填 | 参数名 | 类型       | 说明           | 默认值 |
| :--: | ------ | ---------- | -------------- | ------ |
|  \*  | funcs  | TAnyFunc[] | 需要组合的函数 | -      |

**返回值**: 组合后的函数

**示例**

```ts
import { pipe, curry } from '@cmtlyt/base';
// import { pipe, curry } from '@cmtlyt/base/utils/funcHandler';

const add = curry((a: number, b: number) => a + b);
const multiply = curry((a: number, b: number) => a * b);
const addAndMultiply = pipe(add, multiply(2));
addAndMultiply(1, 2); // 6
```

## debounce

函数防抖

**类型声明**

```ts
type TArgsType<F> = F extends (...args: infer T) => any ? T : never;

function debounce<F extends (...args: any[]) => any>(
  func: F,
  time?: number,
  immediately?: boolean,
): (...args: TArgsType<F>) => void;
```

**参数**

| 必填 | 参数名      | 说明                       | 类型    | 默认值 |
| :--: | ----------- | -------------------------- | ------- | ------ |
|  \*  | func        | 要防抖的函数               | F       | -      |
|      | time        | 防抖时间，默认为 100ms     | number  | 100    |
|      | immediately | 是否立即执行，默认为 false | boolean | false  |

**返回值**: `(...args: TArgsType<F>) => void`

**示例**

```ts
import { debounce } from '@cmtlyt/base';
// import { debounce } from '@cmtlyt/base/utils/funcHandler'

const fn = debounce(() => {
  console.log('hello');
}, 1000);

fn();
fn();
fn();
fn(); // hello

setTimeout(() => {
  fn(); // hello
}, 1500);
```

## throttle

函数节流

**类型声明**

```ts
type TArgsType<F> = F extends (...args: infer T) => any ? T : never;

function throttle<F extends (...args: any[]) => any>(
  func: F,
  time?: number,
  immediately?: boolean,
): (...args: TArgsType<F>) => void;
```

**参数**

| 必填 | 参数名      | 说明                      | 类型    | 默认值 |
| :--: | ----------- | ------------------------- | ------- | ------ |
|  \*  | func        | 要节流的函数              | F       | -      |
|      | time        | 节流时间，默认为 100ms    | number  | 100    |
|      | immediately | 是否立即执行，默认为 true | boolean | true   |

**返回值**: `(...args: TArgsType<F>) => void`

**示例**

```ts
import { throttle } from '@cmtlyt/base';
// import { throttle } from '@cmtlyt/base/utils/funcHandler'

const fn = throttle(() => {
  console.log('hello');
}, 1000);

fn(); // hello
fn();
fn();
fn();

setTimeout(() => {
  fn(); // hello
}, 1500);
```

## chunkTask

大任务分块执行

**类型声明**

```ts
export declare function chunkTask<T, F extends (arg: T) => any = (arg: T) => any>(
  task: F,
): <R extends TUnwrapPromise<ReturnType<F>>>(args: T[] | number) => Promise<R>;
```

**参数**

| 必填 | 参数名 | 说明 | 类型 | 默认值 |
| :--: | ------ | ---- | ---- | ------ |
|  \*  | task   | 任务 | F    | -      |

**返回值**: `(args: T[] | number) => Promise<TCast<ReturnType<F>, Promise<any>>>`

**示例**

```ts
import { chunkTask } from '@cmtlyt/base';
// import { chunkTask } from '@cmtlyt/base/utils/funcHandler';

const task = async (arg: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(arg);
    }, 1000);
  });
};
const chunkedTask = chunkTask(task);
chunkedTask([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

## sleep

等待指定时间

**类型声明**

```ts
function sleep(time: number): Promise<void>;
```

**参数**

| 必填 | 参数名 | 说明 | 类型   | 默认值 |
| :--: | ------ | ---- | ------ | ------ |
|  \*  | time   | 时间 | number | -      |

**返回值**: `Promise<void>`

**示例**

```ts
import { sleep } from '@cmtlyt/base';
// import { sleep } from '@cmtlyt/base/utils/funcHandler';

sleep(1000).then(() => {
  console.log('hello');
});
```
