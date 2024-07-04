# 事件中心

## EventEmitter - (class)

事件中心

### 静态方法

```ts
function getDetaultEmitter(): EventEmitter;
```

### 参数

无

### 返回值

`EventEmitter` 实例

### 实例方法

```ts
interface EventEmitter {
  // 监听事件
  on(eventName: string, callback: TCallback): EventEmitter;
  // 取消监听
  off(eventName: string, callback: TCallback): EventEmitter;
  // 触发事件
  emit(eventName: string, data: any): EventEmitter;
  // 监听一次
  once(eventName: string, callback: TCallback): EventEmitter;
  // 清除监听
  clear(eventName: string): EventEmitter;
  // 清除所有监听
  clearAll(): EventEmitter;
  // 获取可解构方法
  getFuncMap(): {
    on(eventName: string, callback: TCallback): EventEmitter;
    off(eventName: string, callback: TCallback): EventEmitter;
    emit(eventName: string, event: CustomEvent): EventEmitter;
    once(eventName: string, callback: TCallback): EventEmitter;
    clear(eventName: string): EventEmitter;
    clearAll(): EventEmitter;
  };
}
```
