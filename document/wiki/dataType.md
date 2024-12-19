# JavaScript 数据类型

## 基本数据类型

> 基本数据类型是不可变的, 存储在栈内存中, 其值直接存储在变量中

- Number
- String
- Boolean
- Null
- Undefined
- Symbol
- BigInt

:::info 注意
Symbol 虽然是一种基本数据类型, 但是他表现的和对象一样, 可以有方法

BigInt 是一种特殊的数字类型, 用于处理超出常规 Number 类型安全整数范围的大整数
:::

:::warning 诡异的基本数据类型
基本数据类型也有特殊情况, 那就是能被 new 创建的类型, 例如 Number, String, Boolean

这三个基本数据类型都可以通过 new 关键字创建实例, 然后他创建的实例虽然也是各自的类型, 但是他已经不是存储在栈内存中的变量了, 他存储的是一个指针, 指向堆内存中的实例

因为 new 关键字总会在内存中创建一块新的区域来存储

让我们来看几个示例

```js
console.log(new String('红鲤鱼与绿鲤鱼与驴') === '红鲤鱼与绿鲤鱼与驴') // false
console.log(new Number(10086) === 10086) // false
console.log(new Boolean(true) === true) // false
```

这就和 NaN(Not a Number) 有异曲同工之妙了 🤣 ~~(不知道有没有人懂这个梗)~~
:::

## 引用数据类型

> 引用数据类型存储在堆内存中, 变量实际上存储的是指向这些数据的引用 (内存地址). 当复制引用类型变量时, 会创建一个新的引用指向同一个地址

- Object
- Function
- Array
- Date
- RegExp
- Error
- Map
- Set
- WeakMap
- WeakSet
- Promise
- Proxy
- Reflect
- ...
