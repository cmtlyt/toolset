# 数据类型转换

## 数据类型转换介绍

JavaScript是一种动态类型语言,变量没有类型限制,可以随时赋予任意值

```js
const a = y ? 1 : '2';
```

上面代码中a的值是数字还是字符串取决于y的值是真还是假,也就是说a在编译的时候并不知道具体的类型,只有在运行的时候才能得到y的值然后知道a的类型

虽然变量的数据类型是不确定的,但是各种运算符对数据类型是有要求的  如果运算符发现,运算子的类型与预期不符,就会自动转换类型  比如,减法运算符逾期左右两边的运算子都是数值,如果不是,就会自动将他们转为数值

```js
'4' - '3' // 1
```

上面代码中,虽然是两个字符串相减,但是依然得到了1,因为JavaScript自动将他们的类型做了转换

接下来我们就来聊一聊JavaScript中怎么进行数据类型的转换

## 强制转换(显示类型转换)

强制类型转换主要使用`Number()`,`String()`,`Boolean()`这3个函数,手动将各种类型的值分别转换为数字,字符串或者布尔值

### Number()

使用`Number`函数可以将任意的值转化为数值

下面分成两种情况讨论,一种参数是原始类型的值,另一种是对象类型

#### 原始类型

原始类型的转换规则如下

```js
// 数值: 转换后还是原来的值
Number(123) // 123
// 字符串: 如果可以被解析为数值,则转换为对应的值  如果不能被解析为数值的话就会返回NaN  如果是空字符串的话则会返回0
Number('123') // 123
Number('123asdf') // NaN
Number('') // 0
// 布尔值: true转换为1,false转换为0
Number(true) // 1
Number(false) // 0
// undefined: 转换为NaN
Number(undefined) // NaN
// null: 转换为0
Number(null) // 0
```

这里我们特别讨论一下字符串转数值

我们知道,字符串转数值除了`Number`之外还可以用`parseInt`或者`parseFloat`

咱们用过的都知道`parseInt`和`parseFloat`这两个方法把字符串解析为数值的时候都不怎么介意字符串中出现除数字外的字符

```js
Number('123asdf') // NaN
parseInt('123asdf') // 123
parseFloat('123asdf') // 123
Number('123.111') // 123.111
parseInt('123.11a1aaaa') // 123
parseFloat('123.11a1aaaa') // 123.11
```

我们从上面的5/6行也能看出他们俩只要遇到了非数值之后就不解析了,不管你后面有没有数值都不解析了,就好像一个不是舔狗的打工人一样,数值就是他的工钱,我帮你解析一个字符,你就要给我一份工钱,如果你这个字符不是数值,那就相当于你赖账了,那我就不给你继续上班了,这个灵魂比喻应该还是比较形象的,嘿嘿

当然,虽然人家相对`Number`来说大气很多,但是也有特殊情况,就比如下面这两种

```js
parseInt('a123') // NaN
parseFloat('a123') // NaN
```

你一开头就给人家一个非数字,别人什么好处都没有呢,当然直接就不给你解析了,随便甩给你一个`NaN`就完事了,你说是吧

#### 对象

转换对象我们可以先来看几个例子

```js
Number({a: 1}) // NaN
Number([1, 2, 3]) // NaN
Number([1]) // 1
```

欸,第一个我理解,他是对象没法转成数值,那第二个和第三个都是数组,为什么一个可以转换另一个不能转换呢?

好,现在我们就来探讨一下他为啥一下可以一下不可以吧

`Number`他去转换的时候,发现你给他的是个对象,那对象怎么转换成数值啊,没有办法把,这个时候他就会通过其他方法,把你的对象转为自己认识的原始类型

1. 调用对象**自身**的`valueOf`方法,如果返回原始类型的值,则直接对这个值使用`Number`函数
2. 如果调用`valueOf`返回的还是一个对象的话,就调用对象**自身**的`toString`方法,如果返回原始类型的值,则对该值调用`Number`方法
3. 报错

这就是`Number`函数转换对象时的心路历程了,`valueOf -> toString -> Error`

我们来模仿一下这个心路历程吧

```js
function toNumber(val){
  let value = val
  if(typeof value === 'object') {
    value = val.valueOf()
  }
  if(typeof value === 'object') {
    value = val.toString()
  }
  if(typeof value === 'object'){
    throw new Error()
  }
  return Number(value)
}
```

这段代码差不多就是他的心路历程了,一次次的确认他是不是object,就像你的对象一次次确认你是不是爱他一样,如果每次都是不爱,那我直接爆炸,只要有一次你爱我了,我就给你想要的(这么说好像舔狗)

好了那我们现在来看看争议最大的数组吧

```js
[1, 2, 3].valueOf() // [1, 2, 3]
[1, 2, 3].toString() // '1,2,3'
Number('1,2,3') // NaN

[1].valueOf() // [1]
[1].toString() // '1'
Number('1') // 1

[].valueOf() // []
[].toString() // ''
Number('') // 0
```

是吧是吧,没有一点点争议对吧~

当然这个`toString`和`valueOf`方法我们也可以自己重写掉,我这里拿对象来举个例子吧

```js
const obj = {
  valueOf() {
    return 123
  }
}
Number(obj) // 123

const obj2 = {
  toString() {
    return '123'
  }
}
Number(obj2) // 123

const obj3 = {
  valueOf() {
    return obj
  },
  toString() {
    return '234'
  }
}
Number(obj3) // 234

const obj4 = {
  toString() {
    return obj
  }
}
Number(obj4) // TypeError: Cannot convert object to primitive value
```

看到这大家会不会很好奇`obj3`为什么返回的是234而不是`obj.valueOf`返回的123呢?

其实大家前面仔细看的话就会发现,`Number`类型转的心路历程中关心的一直都是你**传入的那个对象**,跟你的返回值没啥关系

## 自动转换(隐式类型转换)

JavaScript遇到逾期和实际不符的地方就会进行数据类型的转换,我们先来看几个例子

```js
'5' - '2' // 3
'5' * '2' // 10
true - 1 // 0
false - 1 // -1
'1' - 1 // 0
'5' * [] // 0
false / 5 // 0
'1abc' - 1 // NaN
null + 1 // 1
undefined + 1 // NaN
```

这些例子中运算符两侧的运算子都被转成了数值进行运算  从`‘abc’ - 1`这个例子里我们就可以看出它内部类型转换的时候调用的是`Number`方法

当然一元运算符也会把运算子转换成数值

```js
+'123' // 123
-'123' // -123
+'asd' // NaN
-'asd' // NaN
+true // 1
-false // 0
```

