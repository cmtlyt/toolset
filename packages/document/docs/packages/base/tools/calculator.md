# 计算器

## Calculator - (class)

计算器, 支持加减乘除和括号, 支持链式调用

### 静态方法

```ts
function group(
  callback: (calc: Calculator) => Calculator | number | void,
  initValue: number
): Calculator | number;
```

### 参数

| 必填 | 参数名    | 说明     | 类型   | 默认值 |
| :--: | --------- | -------- | ------ | ------ |
|      | initValue | 初始化值 | number | 0      |

### 返回值

`Calculator` 实例

### 实例方法

```ts
interface Calculator {
  // 加
  add(value: number): Calculator;
  // 减
  sub(value: number): Calculator;
  // 乘
  mut(value: number): Calculator;
  // 除
  div(value: number): Calculator;
  // 获取当前值
  getCurrValue(): number;
  // 计算结果
  valueOf(): number;
}
```
