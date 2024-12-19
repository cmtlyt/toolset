# 构造方法

## 简介

在 JavaScript 中, class 是一种更简洁的、更面向对象的语法来创建对象和处理继承的方式. constructor 是类的一个特殊方法, 用于初始化创建类的实例. 当使用 new 关键字创建类的实例时, constructor 方法会自动被调用进行实例的初始化.

### 示例

```js
class Person {
  constructor(name) {
    this.name = name
  }
}

const person = new Person('John')

console.log(person.name) // John
```

在这个示例中, 我们定义了一个 Person 类, 并在其 constructor 方法中初始化了 name 属性. 然后我们使用 new 关键字创建了一个 Person 类的实例, 并将其赋值给 person. 最后, 我们使用 person.name 来访问 name 属性的值.

在这其中我们没有手动的调用 constructor 方法, 但他却自动调用了, 这就是因为我们使用了 new 关键字, 所以自动调用了 constructor 方法.

## 那些你可能不知道的事

根据 TC39 的描述, constructor 方法其实可以返回 3 种结果

- EMPTY
- ClassElement
- ClassElementList

**EMPTY**

EMPTY 就是什么都不返回, 在这种情况下会自动返回当前 class 的实例, 例如[示例](#示例)中的 Person 类一样, 他就是直接返回了 Person 类本身的实例

**ClassElement**

ClassElement 从字面上理解就是一个 class 元素, 如果返回 class 元素的话, 那这个 constructor 不会直接返回这个新的 class 元素, 而不是 new 的那个类的实例

从字面上来看的话他应该需要一个 class 元素, 但是实际上, 只要不是[基本数据类型](./dataType.md#基本数据类型), 都可以替换类本身的实例

如果返回的是一个基本数据类型的话那么和返回 EMPTY 是没有本质区别的

示例

```js
const ageObj = { age: 20 }

class Person {
  constructor(name) {
    this.name = name
    return ageObj
  }
}

const person = new Person('John')
console.log(person.name) // undefined
console.log(person.age) // 20
console.log(person) // { age: 20 }
console.log(person instanceof Person) // false
console.log(person === ageObj) // true
```

**ClassElementList**

ClassElementList 就是一个 class 元素列表, 如果返回 class 元素列表的话, 那么这个 constructor 就会返回一个新的 class 元素列表, 而不是 new 的那个类的实例

同样, 从字面上来看的话他是一个 class 元素列表, 但是实际上, 他可以返回任何类型的数组, 包括 `[1]`, `['']`, `[true]` 等, 他并不会深度判断数组中元素的实际类型

ClassElement 的返回值为一个数组那就是 ClassElementList 了, 只是底层会被识别为 ClassElementList 罢了

对于我们使用者来说的话, ClassElementList 和 ClassElement 没啥区别

## 补充

当然不仅是 class 的 constructor 满足这个返回规则, function 类也满足这个返回值的规则

```js
const obj = {}

class A {
  constructor() {
    this.value = 'test-A'
    return obj
  }
}

function B() {
  this.value = 'test-B'
  return obj
}

const a = new A()
const b = new B()

console.log(a.value) // undefined
console.log(b.value) // undefined

console.log(a === b) // true
```
