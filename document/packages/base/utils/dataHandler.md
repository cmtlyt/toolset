# 数据处理相关方法

## getArray

参数归一化为数组

**类型声明**

```ts
function getArray<T>(value: T): T extends any[] ? T : T[];
```

**参数**

| 必填 | 参数  | 说明 | 类型 | 默认值 |
| :--: | ----- | ---- | ---- | ------ |
|      | value | 数组 | any  |        |

**返回值**: `array`

**示例**

```ts
import { getArray } from '@cmtlyt/base';
// import { getArray } from '@cmtlyt/base/utils/dataHandler';

const arr = getArray(1);
console.log(arr); // [1]
console.log(getArray([2])); // [2]
console.log(getArray()); // []
console.log(getArray({ a: 1 })); // [{ a: 1 }]
```

## getArraySlice

获取数组切片

**类型声明**

```ts
function getArraySlice<T extends any[]>(array: T, size: number): T[];
```

**参数**

| 必填 | 参数  | 说明     | 类型   | 默认值 |
| :--: | ----- | -------- | ------ | ------ |
|  \*  | array | 数组     | any[]  |        |
|      | size  | 切片大小 | number |        |

**返回值**: `array`

**示例**

```ts
import { getArraySlice } from '@cmtlyt/base';
// import { getArraySlice } from '@cmtlyt/base/utils/dataHandler';

const arr = getArraySlice([1, 2, 3, 4, 5], 2);
console.log(arr); // [[1, 2], [3, 4], [5]]
console.log(getArraySlice([1, 2, 3, 4, 5], 3)); // [[1, 2, 3], [4, 5]]
console.log(getArraySlice([1, 2, 3, 4, 5], 6)); // [[1, 2, 3, 4, 5]]
```

## deepClone

深拷贝

**类型声明**

```ts
function deepClone<T>(obj: T): T;
```

**参数**

| 必填 | 参数 | 说明   | 类型 | 默认值 |
| :--: | ---- | ------ | ---- | ------ |
|      | obj  | 任意值 | T    |        |

**返回值**: `T`

**示例**

```ts
import { deepClone } from '@cmtlyt/base';
// import { deepClone } from '@cmtlyt/base/utils/dataHandler';

const obj = {
  a: 1,
  b: {
    c: 2,
  },
};
const obj2 = deepClone(obj);
obj2.a = 2;
obj2.b.c = 3;
console.log(obj.a); // 1
console.log(obj.b.c); // 2
```

## merge

合并对象

**类型声明**

```ts
export declare function merge<T>(target: T, ...source: any[]): T;
```

**参数**

| 必填 | 参数      | 说明         | 类型  | 默认值 |
| :--: | --------- | ------------ | ----- | ------ |
|  \*  | target    | 合并的目标   | T     |        |
|      | ...source | 合并数据来源 | any[] |        |

**返回值**: `T`

**示例**

```ts
import { merge } from '@cmtlyt/base';
// import { merge } from '@cmtlyt/base/utils/dataHandler';

const obj = {
  a: 1,
  b: {
    c: 2,
  },
};
const obj2 = merge(obj, {
  a: 2,
  b: {
    c: 3,
  },
});
console.log(obj2.a); // 2
console.log(obj2.b.c); // 3
console.log(obj === obj2); // true
```

## cloneMerge

深拷贝合并对象

**类型声明**

```ts
export declare function cloneMerge<T>(target: T, ...source: any[]): T;
```

**参数**

| 必填 | 参数      | 说明         | 类型  | 默认值 |
| :--: | --------- | ------------ | ----- | ------ |
|  \*  | target    | 合并的目标   | T     |        |
|      | ...source | 合并数据来源 | any[] |        |

**返回值**: `T`

**示例**

```ts
import { cloneMerge } from '@cmtlyt/base';
// import { cloneMerge } from '@cmtlyt/base/utils/dataHandler';

const obj = {
  a: 1,
  b: {
    c: 2,
  },
};
const obj2 = cloneMerge(obj, {
  a: 2,
  b: {
    c: 3,
  },
});
console.log(obj2.a); // 2
console.log(obj2.b.c); // 3
console.log(obj === obj2); // false
```

## asyncReplace

异步替换

**类型声明**

```ts
function asyncReplace(
  str: string,
  pattern: string | RegExp,
  replacer: ((match: string, ...args: any[]) => Promise<string> | string) | string,
): Promise<string>;
```

**参数**

| 必填 | 参数     | 说明     | 类型                                                         | 默认值 |
| :--: | -------- | -------- | ------------------------------------------------------------ | ------ |
|  \*  | str      | 字符串   | string                                                       | -      |
|  \*  | pattern  | 正则     | string\|RegExp                                               | -      |
|  \*  | replacer | 替换函数 | (match: string, ...args: any[]) => Promise<string> \| string | -      |

**返回值**: `Promise<string>`

**示例**

```js
import { asyncReplace } from '@cmtlyt/base';
// import { asyncReplace } from '@cmtlyt/base/utils/dataHandler'

asyncReplace('hello world', 'world', async (match) => {
  return '@cmtlyt/base';
}); // hello @cmtlyt/base
```

## asyncFilter

异步过滤

**类型声明**

```ts
function asyncFilter<T>(arr: T[], predicate: (item: T, index: number) => Promise<boolean> | boolean): Promise<T[]>;
```

**参数**
| 必填 | 参数 | 说明 | 类型 | 默认值 |
| :--: | -------- | -------- | ------------------------------------------------------------ | ------ |
| \* | arr | 数组 | T[] | - |
| \* | predicate | 过滤函数 | (item: T, index: number) => Promise<boolean> \| boolean | - |

**返回值**: `Promise<T[]>`

**示例**

```js
import { asyncFilter } from '@cmtlyt/base';
// import { asyncFilter } from '@cmtlyt/base/utils/dataHandler'

asyncFilter([1, 2, 3, 4, 5], async (item) => {
  return item > 2;
}); // Promise<[3, 4, 5]>
```
