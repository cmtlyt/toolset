# 斐波那契数列

> 斐波那契数列：F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2)

## 解决方法

## 递归

```js
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
```

但这样的方式会导致当求解数量过大的时候，递归层数很深，运行时间长。

所以可以在递归里面加个`map` 来缓存已经计算过的数据

### 优化

```js
const map = new Map();

function fib(n) {
  if (n < 2) return n;
  if (map.has(n)) return map.get(n);
  const res = fib(n - 1) + fib(n - 2);
  map.set(n, res);
  return res;
}
```

这份代码如果放在单一解决某个问题的文件运行是没问题的，但如果作为一个`hook` 来使用的话，因为`map` 的定义在外部作用域，会对外层作用域变量造成污染，所以将`map` 的声明改成函数内部。

```js
function fib(n, map = new Map()) {
  if (n < 2) return n;
  if (map.has(n)) return map.get(n);
  const res = fib(n - 1, map) + fib(n - 2, map);
  map.set(n, res);
  return res;
}
```

看似没啥问题了，重新写一个函数，返回一整个斐波那契数列

```js
function fibs(n) {
  const res = [];
  for (let i = 0; i <= n; i++) {
    res.push(fib(i));
  }
  return res;
}
```

### 函数导出

由于现在有两个函数了，但是对于`fibs` 函数里面的循环中，每次调用`fib` 函数都会实例化一个`map`，但这是放在在外层的，在`fib` 函数引用了外部的`map` 变量（闭包）。

```js
function createFibFunction() {
  const mp = new Map();

  function fib(n) {
    if (n < 2) return n;
    if (!mp.has(n)) {
      const res = fib(n - 1) + fib(n - 2);
      mp.set(n, res);
    }
    return mp.get(n);
  }

  function fibs(n) {
    const res = [];
    for (let i = 0; i <= n; i++) {
      res.push(fib(i));
    }
    return res;
  }

  return { fib, fibs };
}
```

最后，将两个方法进行导出就能提供给外部使用了

```js
const { fib, fibs } = createFibFunction();
export { fib, fibs };
```

## reduce

在reduce中，有点像`for`循环遍历叠加，参数中有四个参数：

| 参数         | 说明                         | 是否必选 |
| ------------ | ---------------------------- | -------- |
| total        | 初始值，每次迭代后返回的结果 | ✔️       |
| currentVal   | 当前遍历到的元素             | ✔️       |
| currentIndex | 当前遍历到的元素下标         | ❌       |
| arr          | 当前元素所属的数组对象       | ❌       |

```js
function fibs(n) {
  return Array.from({ length: n }).reduce((res, _, index) => {
    if (index < 2) {
      res.push(1);
    } else {
      res.push(res[index - 1] + res[index - 2]);
    }
    return res;
  }, []);
}
```

`Array.from({ length: n })` 是为了构造一个长度为n的数组。

还可以通过增加一个函数来给数组里面每个值赋值：`Array.from({length:9},(_, index)=> index)`

## 生成器

> 迭代器的作用就是可以是数据结构可以通过循环遍历，比如Array、Object、Map和Set。
>
> 他们都可以通过调用`next()`方法进行迭代

### 自定义迭代器

在Object中可以自定义实现一个`Symbol.iterator` 来自定义迭代器方法，在`next()`方法中通过返回`{done: 是否终止, value: 返回值}`来判断关闭（没法继续遍历）。

```js
const obj = {
  arr: [1, 2, 3, 4, 5],
  [Symbol.iterator]() {
    let index = 0;
    return {
      arr: this.arr,
      next() {
        if (index < 5) {
          return {
            value: this.arr[index++],
            done: false,
          };
        }
        return {
          value: undefined,
          done: true,
        };
      },
    };
  },
};
for (let i of obj) {
  console.log(i);
}
```

而生成器就是在`ES6`新增的一个结构，拥有在一个函数块内暂停和恢复代码执行的能力。

在声明生成器只需要在`function`前面加一个`星号(*)`，通过`yield` 关键字进行暂停，通过调用该生成器返回实例的`next()` 方法恢复执行。

```js
function* fibIterator(n) {
  let now = 1,
    next = 1,
    count = 0;
  while (true) {
    yield now;
    [now, next] = [next, now + next];
    count++;
    if (count >= n) {
      return;
    }
  }
}

function fibs(n) {
  const iterator = fibIterator(n);
  const res = [];
  for (let i of iterator) {
    res.push(i);
  }
  return res;
}
```

另外一种解法，利用`take(n)`会给定`n`个迭代次数的迭代器。

```js
function* fibIterator(i = 1, j = 1) {
  while (!(yield i)) [i, j] = [j, i + j];
}

console.log([...fibIterator().take(10)]);
```

## 完整code

```js
// getFib.js
function createFibFunction() {
  const mp = new Map();

  function fib(n) {
    if (n < 2) return n;
    if (!mp.has(n)) {
      const res = fib(n - 1) + fib(n - 2);
      mp.set(n, res);
    }
    return mp.get(n);
  }

  function fibs(n) {
    const res = [];
    for (let i = 0; i <= n; i++) {
      res.push(fib(i));
    }
    return res;
  }

  return { fib, fibs };
}

const { fib, fibs } = createFibFunction();
export { fib, fibs };
```

```html
<!-- test.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <script type="module">
      import { fib, fibs } from './getFibFunction.js';
      console.log(fib(10), fibs(10)); // 55 [0,1,1,2,3,5,8,13,21,34,55]
    </script>
  </body>
</html>
```

## 知识点

### 闭包

如果一个函数需要用到外部的变量或者两个函数需要借助一个变量来传递就可以用闭包。

### 模块导出

> 模块导出的作用就是为了能让外部文件访问到该文件里面的变量、方法和类

#### 分类

1. 分别导出

   ```js
   export const a = 1;
   export function test() {
     console.log('test');
   }

   // 引入
   import { a, test } from './test.js';
   ```

2. 统一导出

   ```js
   const a = 1;
   function test() {
     console.log('test');
   }
   export { a, test };

   // 引入
   import * as myFunc from './test.js';
   console.log(myFunc.a); // 1
   console.log(myFunc.test()); // test
   ```

3. 默认导出

   ```js
   function test() {
     console.log('test');
   }
   export default test;

   // 引入
   import myFunc from './test.js';
   console.log(myFunc.test()); // test
   ```

## 总结

1. 找到一个问题的解决方式之后可以思考有没有优化的地方（时间、空间、代码可读性、接口使用方便性）。
2. 写一个模块的时候要在外面调用更加方便，比如我这里一开始如果是导出`export createFibFunction`，在调用模块的时候就还需要去实例化，但换成最终那样子的话就可以直接调用`fib` 和 `fibs` 方法了。
