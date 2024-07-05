# 数组方法

## 遍历方法概览

- [forEach](#foreach)
- [map](#map)
- [filter](#filter)
- [find](#find)
- [findIndex](#findindex)
- [every](#every)
- [some](#some)
- [reduce](#reduce)

## forEach

> forEach 单纯就是用来遍历数组的(看起来很废物,但是巨常用)

### 函数签名

```ts
Array.prototype.forEach<T>(callback:(item:T,index:number,array:T[]),thisArg:any):void;
```

### 函数签名解析

我们从函数签名可以看出他接受一个回调参数和一个回调参数的 this 指向,然后运行完之后啥都不返回

### 特点

#### 循环次数

和 for 循环等普通循环类似,但是他不会因为原数组的修改而改变循环次数

```js
const arr = [1, 2, 3]

arr.forEach((item, index) => {
  console.log(index, item)
  arr.push(index)
})

console.log(arr)
```

```txt title="output"
0 1
1 2
2 3
[1,2,3,0,1,2]
```

对比普通循环

```js
const arr = [1, 2, 3]

for (let i = 0; i < arr.length; i++) {
  console.log(i, arr[i])
  arr.push(i)
  if (i === 10) {
    break
  }
}

console.log(arr)
```

```txt title="output"
0 1
1 2
2 3
3 0
4 1
5 2
6 3
7 4
8 5
9 6
10 7
[1,2,3,0,1,2,3,4,5,6,7]
```

可以看出如果我不在 i 等于 10 的时候中断循环的话那他就会无限循环下去

当然你也可以用下面这种方式模拟 forEach 的循环次数

```js {2,4}
const arr = [1, 2, 3]
const length = arr.length

for (let i = 0; i < length; i++) {
  console.log(i, arr[i])
  arr.push(i)
}

console.log(arr)
```

```txt title="output"
0 1
1 2
2 3
[1,2,3,0,1,2]
```

## map

## filter

## find

## findIndex

## every

## some

## reduce
