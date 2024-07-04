# 上传管理器

## createUploader - (function)

创建一个上传管理器, 支持并发上传, 可以调整并发的类型, 例如按分片并发, 或者按文件并发, 自动管理上传状态, 并且返回上传进度信息, 内部使用 fetch 实现文件上传, 可自行传递 headers 和 fetch 的配置, 并且支持通过函数自定义请求体

### 参数

| 必填 | 参数名                 | 说明          | 类型                   | 默认值       |
| :--: | ---------------------- | ------------- | ---------------------- | ------------ |
|  \*  | options                | uploader 配置 | string                 |              |
|  \*  | options.url            | 上传地址      | string                 |              |
|      | options.maxConcurrent  | 最大并发数    | number                 | 3            |
|      | options.concurrentNode | 并发节点类型  | 'file'\|'chunk'        | 'chunk'      |
|      | options.chunkSize      | 分片大小      | number                 | 1024 \* 1024 |
|      | options.dataType       | 数据类型      | 'FormData'\|'binary'   | 'FormData'   |
|      | options.dataKey        | 数据 key      | string                 | 'file'       |
|      | options.responseType   | 响应类型      | 'json'                 | 'json'       |
|      | options.retryCount     | 重试次数      | number                 | 3            |
|      | options.requestMethod  | 请求方法      | 'POST'                 | 'POST'       |
|      | options.headers        | 请求头        | Record<string, string> | {}           |
|      | options.bodyHandler    | 自定义请求体  | TBodyHanderFunc        | -            |
|      | options.headersHandler | 自定义请求体  | THeadersHandler        | -            |
|      | options.bodyHandler    | 自定义请求体  | TBodyHanderFunc        | -            |
|      | forceCreate            | 强制创建实例  | boolean                | false        |

:::details 类型补充

```ts
type TBodyHanderFunc = (body: {
  chunk: Blob;
  chunkIdx: number;
  customOption: any;
}) => Record<string, any>;
type THeadersHandler = (body: {
  chunkIdx: number;
  currentHeanders: Record<string, any>;
  customOption: any;
}) => Record<string, any> | Promise<Record<string, any>>;
```

:::

:::danger 警告
`TBodyHanderFunc` 禁止使用闭包
`THeadersHanderFunc` 禁止使用闭包
:::

### 返回值

`UploadController` 实例

#### 实例类型声明

```ts
type TFileLive = File | Blob | string;
interface IUploadOptions {
  onProgress?: (progressInfo: IProgressInfo) => void;
  customOption?: any;
}
interface IUploadResult {
  taskInfo: IUploadFinishInfo;
  customOption: any;
}
interface IUploadFinishInfo {
  status: 'finished';
  message: string;
  chunks: number[];
  errorChunks: number[];
}

interface UploadController {
  // 上传
  upload(file: TFileLive, options?: IUploadOptions): Promise<IUploadResult>;
  // 重试
  retry(
    file: TFileLive,
    chunkIdxs?: number[],
    options?: IUploadOptions
  ): Promise<IUploadResult>;
  // 取消
  abort(file: TFileLive): void;
  // 清空
  clear(): void;
  // 关闭
  close(): void;
}
```
