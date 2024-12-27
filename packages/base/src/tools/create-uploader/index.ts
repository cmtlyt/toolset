import type { TObject } from '../../types/base';
import type { PoolType } from '../create-pool';
import type { WorkerFuncs } from '../create-worker-func';
import { getType } from '../../cir-dep';
import { warning } from '../../common/warning';
import { createLinkByString, getArraySlice, getRandomString, isBlob, isFile, isUrl } from '../../utils';
import { createPool } from '../create-pool';
import { createWorkerFunc } from '../create-worker-func';

// 允许的上传请求体格式
const ALLOWED_DATA_TYPES = ['FormData', 'binary'];

// 允许的返回体格式
const ALLOWED_RESPONSE_TYPES = ['json', 'string'];

// 允许的请求方式
const ALLOWED_REQUEST_METHODS = ['POST', 'PUT'];

// 允许的并发节点
const ALLOWED_CONCURRENT_NODES = ['chunk', 'file'];

function cast(key: string, type: string | string[], value: any, defaultValue: any, allowedTypes?: any[]) {
  if (
    // 类型判断
    (Array.isArray(type) ? !type.includes(getType(value)) : getType(value) !== type)
    // 允许值判断
    || (allowedTypes && !allowedTypes.includes(value))
  ) {
    warning(`options.${key} 必须是${type}，已使用默认值 ${defaultValue} 代替`);
    return defaultValue;
  }
  return value;
}

type HeadersHandler = (data: {
  chunkIdx: number;
  customOption: any;
  currentHeanders: Record<string, any>;
}) => Promise<Record<string, any>>;

type BodyHandler = (options: { chunk: Blob; chunkIdx: number; customOption: any }) => Promise<Record<string, any>>;

interface RequestInit {
  headers?: Record<string, string>;
}

interface UploadOptions {
  url: string;
  maxConcurrent?: number;
  concurrentNode?: 'chunk' | 'file';
  chunkSize?: number;
  dataType?: 'FormData' | 'binary';
  dataKey?: string;
  responseType?: 'json' | 'string';
  retryCount?: number;
  requestMethod?: 'POST' | 'PUT';
  headers?: Record<string, string>;
  headersHandler?: HeadersHandler;
  bodyHandler?: BodyHandler;
  requestOptions?: RequestInit;
}

function normalizeOptions(options: UploadOptions): Required<UploadOptions> {
  if (!options)
    throw new TypeError('options 不能为空');
  if (typeof options !== 'object')
    throw new TypeError('options 必须是对象');
  if (!options.url && options.url !== 'string')
    throw new TypeError('options.url 必须是非空字符串');
  const {
    url,
    maxConcurrent,
    concurrentNode,
    chunkSize,
    dataType,
    dataKey,
    responseType,
    retryCount,
    requestMethod,
    headers,
    headersHandler,
    bodyHandler,
    requestOptions,
  } = options;
  const _dataType = cast('dataType', 'string', dataType, 'FormData', ALLOWED_DATA_TYPES);
  const normalizedOptions = {
    url,
    maxConcurrent: cast('maxConcurrent', 'number', maxConcurrent, 3),
    concurrentNode: cast('concurrentNode', 'string', concurrentNode, 'chunk', ALLOWED_CONCURRENT_NODES),
    chunkSize: cast('chunkSize', 'number', chunkSize, 1024 * 512),
    dataType: _dataType,
    dataKey: cast('dataKey', 'string', dataKey, 'file'),
    responseType: cast('responseType', 'string', responseType, 'json', ALLOWED_RESPONSE_TYPES),
    retryCount: cast('retryCount', 'number', retryCount, 0),
    requestMethod: cast('requestMethod', 'string', requestMethod, 'POST', ALLOWED_REQUEST_METHODS),
    headers: cast('headers', 'object', headers, {
      'Content-Type': _dataType === 'FormData' ? 'multipart/form-data' : 'application/octet-stream',
    }),
    headersHandler: cast('headersHandler', ['function', 'asyncfunction'], headersHandler, () => {}),
    bodyHandler: cast('bodyHandler', ['function', 'asyncfunction'], bodyHandler, () => {}),
    requestOptions: cast('requestOptions', 'object', requestOptions, {}),
  };
  return normalizedOptions;
}

/**
 * @param {UploadInfo} options
 * @returns {Promise<UploadFinishInfo>}
 */

interface UploadInfo {
  uploadInfo: {
    id: string;
    customOption: any;
  };
  fileUrl: string;
  chunkIdxInfo: [number, number];
  chunkSize: number;
  serverPath: string;
  dataKey: string;
  responseType: string;
  requestMethod: string;
  headers: Record<string, string>;
  chunkIdxs: number[];
  retryCount: number;
  dataType: Required<UploadOptions>['dataType'];
  requestOptions?: RequestInit;
}

interface UploadFinishInfo {
  data?: any;
  status?: 'finished';
  message?: string;
  chunks?: number[];
  errorChunks?: number[];
}

const uploadWorkerFunc: (options: UploadInfo) => Promise<UploadFinishInfo> = async ({
  uploadInfo,
  fileUrl,
  chunkIdxInfo,
  chunkSize,
  serverPath,
  dataKey,
  responseType,
  requestMethod,
  headers,
  chunkIdxs: _chunkIdxs,
  retryCount,
  dataType,
  requestOptions,
}) => {
  const errorIdxs: number[] = [];
  const file = await fetch(fileUrl).then(res => res.blob());
  const [chunkStart, chunkEnd] = chunkIdxInfo;
  const chunkIdxs
    = _chunkIdxs.length > 0 ? _chunkIdxs : Array.from({ length: chunkEnd - chunkStart }, (_, i) => chunkStart + i);
  // 获取切片数据
  const getChunkData = (idx: number) => {
    if (chunkSize <= 0)
      return file.slice();
    const start = idx * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    return file.slice(start, end);
  };
  // 响应体处理
  const getResponse = async (res: Response) => {
    if (responseType === 'json') {
      return await res.json();
    }
    else if (responseType === 'string') {
      return await res.text();
    }
    else {
      return 'none';
    }
  };
  // 响应处理
  const fetchHandle = async (idx: number, res: Response) => {
    const response = await getResponse(res);
    const progressInfo = {
      chunkIdx: idx,
      status: 'loading',
      response,
    };
    if (res.status === 200) {
      progressInfo.status = 'success';
    }
    else {
      progressInfo.status = 'fail';
      errorIdxs.push(idx);
    }
    // eslint-disable-next-line no-restricted-globals
    self.postMessage(progressInfo);
  };
  // 错误处理
  const fetchErrorHandle = (idx: number, err: Error) => {
    errorIdxs.push(idx);
    // eslint-disable-next-line no-restricted-globals
    self.postMessage({
      chunkIdx: idx,
      status: 'error',
      message: err,
      uploadInfo,
    });
  };
  // @ts-expect-error 通过 importScripts 引入
  const _userHeadersHandler: HeadersHandler = userHeadersHandler || (() => {});
  // @ts-expect-error 通过 importScripts 引入
  const _userBodyHandler: BodyHandler = userBodyHandler || (() => {});
  // 表单请求体处理
  const formDataBodyHandler = async (idx: number) => {
    const chunk = getChunkData(idx);
    const formData = new FormData();
    formData.append(dataKey, chunk);
    formData.append('chunkIdx', `${idx}`);
    const extendData = await _userBodyHandler({
      chunk,
      chunkIdx: idx,
      customOption: uploadInfo.customOption,
    });
    if (typeof extendData === 'object') {
      Object.keys(extendData).forEach((key) => {
        formData.append(key, extendData[key]);
      });
    }
    return formData;
  };
  const binaryBodyHandler = async (idx: number) => {
    const chunk = getChunkData(idx);
    return chunk;
  };
  // 请求体处理
  const bodyHandler = async (idx: number) => {
    if (dataType === 'FormData') {
      return formDataBodyHandler(idx);
    }
    else if (dataType === 'binary') {
      return binaryBodyHandler(idx);
    }
  };
  // 请求头处理
  const heandersHandler = async (idx: number) => {
    const extendHeaders = await _userHeadersHandler({
      chunkIdx: idx,
      currentHeanders: headers,
      customOption: uploadInfo.customOption,
    });
    return {
      ...headers,
      ...extendHeaders,
    };
  };
  // 实际上传
  const run = async (chunkIdxs: number[]) => {
    for (const idx of chunkIdxs) {
      const body = await bodyHandler(idx);
      const headers = await heandersHandler(idx);
      // eslint-disable-next-line no-console
      console.log('run', headers);
      await fetch(serverPath, {
        ...requestOptions,
        method: requestMethod,
        body,
        headers,
      })
        .then(fetchHandle.bind(null, idx))
        .catch(fetchErrorHandle.bind(null, idx));
    }
  };

  await run(chunkIdxs);

  for (let i = 0; i < retryCount; ++i) {
    if (errorIdxs.length === 0)
      break;
    const retryChunks = [...errorIdxs];
    errorIdxs.length = 0;
    await run(retryChunks);
  }

  return {
    status: 'finished',
    message: '上传结束',
    chunks: chunkIdxs,
    errorChunks: errorIdxs,
  };
};

const UPLOAD_CONTROLLER_STATUS = {
  waiting: 'waiting',
  uploading: 'uploading',
  closed: 'closed',
};

type FileLive = Blob | File | string;

async function getFile(file: FileLive) {
  if (isFile(file))
    return Promise.resolve(file as File);
  if (isBlob(file))
    return Promise.resolve(file as Blob);
  if (isUrl(file)) {
    return await fetch(file as string).then(res => res.blob());
  }
}

function formatFuncString(funcString: string) {
  if (!funcString)
    return '';
  if (funcString.includes('=>'))
    return funcString;
  if (funcString.startsWith('function'))
    return funcString;
  if (funcString.startsWith('async function'))
    return funcString;
  if (funcString.startsWith('async'))
    return funcString.replace('async', 'async function ');
  return `function ${funcString}`;
}

function workerUtilsGenerate({
  bodyHandler,
  headersHandler,
}: {
  bodyHandler: BodyHandler;
  headersHandler: HeadersHandler;
}) {
  const bodyHandlerStr = formatFuncString(bodyHandler?.toString());
  const headersHandlerStr = formatFuncString(headersHandler?.toString());
  return createLinkByString(`
    ${!bodyHandler ? '' : `const userBodyHandler = ${bodyHandlerStr};`}
    ${!headersHandler ? '' : `const userHeadersHandler = ${headersHandlerStr};`}
  `);
}

const instanceMap: TObject<UploadController> = {};

interface UploadProgressInfo {
  chunkIdx: number;
  status: 'loading' | 'success' | 'fail' | 'error';
  response: any;
}

interface UploadResult {
  taskInfo: UploadFinishInfo[];
  taskStatus: 'success' | 'error';
  errorChunks: number[];
  customOption: any;
}

interface UploadOptionsProp {
  onProgress?: (progress: UploadProgressInfo) => void;
  customOption?: any;
}

interface UploadQueueItem extends UploadOptionsProp {
  file: FileLive;
  resolve: (data: UploadResult) => void;
  reject: (err: Error) => void;
  chunkIdxs: number[];
}

class UploadController {
  static getInstance(options: UploadOptions, forceCreate = false) {
    const { url } = options;
    if (forceCreate) {
      return (instanceMap[url] = new UploadController(options));
    }
    return (instanceMap[url] ??= new UploadController(options));
  }

  #_serverPath: string;
  #_maxConcurrent: number;
  #_concurrentNode: string;
  #_chunkSize: number;
  #_dataType: Required<UploadOptions>['dataType'];
  #_dataKey: string;
  #_responseType: string;
  #_retryCount: number;
  #_requestMethod: string;
  #_originOptions: Required<UploadOptions>;
  #_uploadQueue: UploadQueueItem[];
  #_status: string;
  #_finishInfoMap: TObject<UploadFinishInfo[]>;
  #_uploadWorkerPool: PoolType<WorkerFuncs<(options: UploadInfo) => Promise<UploadFinishInfo>>>;

  /**
   * @param {UploadOptions} options
   */
  constructor(options: UploadOptions) {
    const _options = options as Required<UploadOptions>;
    this.#_serverPath = options.url;
    this.#_maxConcurrent = _options.maxConcurrent;
    this.#_concurrentNode = _options.concurrentNode;
    this.#_chunkSize = _options.chunkSize;
    this.#_dataType = _options.dataType;
    this.#_dataKey = _options.dataKey;
    this.#_responseType = _options.responseType;
    this.#_retryCount = _options.retryCount;
    this.#_requestMethod = _options.requestMethod;
    const { bodyHandler, headersHandler } = _options;

    this.#_originOptions = _options;
    this.#_uploadQueue = [];
    this.#_status = UPLOAD_CONTROLLER_STATUS.waiting;
    this.#_finishInfoMap = {};
    const workerUtilsLink = workerUtilsGenerate({
      bodyHandler,
      headersHandler,
    });
    this.#_uploadWorkerPool = createPool(
      () => createWorkerFunc(uploadWorkerFunc, [workerUtilsLink], { reuse: false }),
      this.#_maxConcurrent,
      Symbol('uploader'),
    );
  }

  #_onProgress(progressCallback: (progress: UploadProgressInfo) => void, progressInfo: UploadProgressInfo) {
    progressCallback(progressInfo);
  }

  #_getTaskStatus(finishInfo: { data?: UploadFinishInfo }[]) {
    if (finishInfo.some(item => item.data?.errorChunks?.length)) {
      return 'error';
    }
    return 'success';
  }

  #_getErrorChunks(finishInfo: { data?: UploadFinishInfo }[]): number[] {
    return finishInfo.reduce((pre, cur) => {
      return pre.concat(cur.data?.errorChunks || []);
    }, [] as number[]);
  }

  async #_workerResolve(
    resolve: (data: UploadResult) => void,
    uploadInfo: { id: string; workerTotal: number; customOption: any },
    res: UploadFinishInfo,
  ) {
    const { id, workerTotal } = uploadInfo;
    const finishInfo = this.#_finishInfoMap[id];
    finishInfo.push({ data: res });
    if (finishInfo.length >= workerTotal) {
      resolve({
        taskInfo: finishInfo,
        taskStatus: this.#_getTaskStatus(finishInfo),
        errorChunks: this.#_getErrorChunks(finishInfo),
        customOption: uploadInfo.customOption,
      });
      delete this.#_finishInfoMap[id];
      // 如果没有
      if (!Object.keys(this.#_finishInfoMap)) {
        this.#_status = UPLOAD_CONTROLLER_STATUS.waiting;
      }
    }
  }

  async #_runWorker({ uploadInfo, fileUrl, start, end, onProgress, worker, resolve, reject, chunkIdxs = [] }: {
    start: number;
    end: number;
    worker: WorkerFuncs<(options: UploadInfo) => Promise<UploadFinishInfo>>;
    workerTotal?: number;
    uploadInfo: { id: string; workerTotal: number; customOption: any };
    fileUrl: string;
    chunkIdxs?: number[];
    onProgress: (progress: UploadProgressInfo) => void;
    resolve: (data: UploadResult) => void;
    reject: (err: Error) => void;
  }) {
    const task: UploadInfo = {
      uploadInfo,
      chunkIdxs,
      fileUrl,
      chunkIdxInfo: [start, end],
      chunkSize: this.#_chunkSize,
      serverPath: this.#_serverPath,
      dataKey: this.#_dataKey,
      responseType: this.#_responseType,
      requestMethod: this.#_requestMethod,
      headers: this.#_originOptions.headers,
      retryCount: this.#_retryCount,
      dataType: this.#_dataType,
    };
    const onMessage = this.#_onProgress.bind(this, onProgress);
    worker.on(onMessage);
    return worker
      .run(task)
      .then(this.#_workerResolve.bind(this, resolve, uploadInfo), reject)
      .finally(() => {
        worker.remove(onMessage);
        this.#_runTaskPreHandle();
      });
  }

  async #_concurrentRunTask({
    runWorkerBaseData,
    retryChunksMap,
    taskChunkSize,
    chunkTotal,
  }: {
    runWorkerBaseData: {
      workerTotal?: number;
      uploadInfo: { id: string; workerTotal: number; customOption: any };
      fileUrl: string;
      onProgress: (progress: UploadProgressInfo) => void;
      resolve: (data: UploadResult) => void;
      reject: (err: Error) => void;
    };
    retryChunksMap: number[][];
    taskChunkSize: number;
    chunkTotal: number;
  }) {
    if (retryChunksMap.length) {
      for (const idx in retryChunksMap) {
        const poolItem = await this.#_uploadWorkerPool.get();
        this.#_runWorker({
          chunkIdxs: retryChunksMap[idx],
          start: 0,
          end: 0,
          worker: poolItem.data()!,
          ...runWorkerBaseData,
        });
      }
      return;
    }

    if (this.#_concurrentNode === 'chunk') {
      for (let idx = 0; idx < this.#_maxConcurrent; ++idx) {
        const poolItem = await this.#_uploadWorkerPool.get();
        const start = idx * taskChunkSize;
        const end = Math.min(chunkTotal, start + taskChunkSize);
        this.#_runWorker({
          start,
          end,
          worker: poolItem.data()!,
          ...runWorkerBaseData,
        });
      }
      return;
    }

    if (this.#_concurrentNode === 'file') {
      runWorkerBaseData.workerTotal = 1;
      const poolItem = await this.#_uploadWorkerPool.get();
      this.#_runWorker({
        start: 0,
        end: chunkTotal,
        worker: poolItem.data()!,
        ...runWorkerBaseData,
      });
    }
  }

  /**
   * @param {number[][]} retryChunksMap
   */
  #_getUploadNeedWorkerTotal(retryChunksMap: number[][]) {
    if (retryChunksMap.length)
      return retryChunksMap.length;
    if (this.#_concurrentNode === 'chunk')
      return this.#_maxConcurrent;
    if (this.#_concurrentNode === 'file')
      return 1;
    return 0;
  }

  async #_runTaskPreHandle() {
    if (this.#_status === UPLOAD_CONTROLLER_STATUS.closed)
      return;
    if (this.#_uploadQueue.length === 0)
      return;
    if (this.#_uploadWorkerPool.usableCount === 0)
      return;

    this.#_status = UPLOAD_CONTROLLER_STATUS.uploading;
    const {
      file: _templateFile,
      resolve,
      reject,
      chunkIdxs = [],
      onProgress = () => {},
      customOption = {},
    } = this.#_uploadQueue.shift()!;
    const file = (await getFile(_templateFile))!;
    const fileUrl = URL.createObjectURL(file);
    // 总chunk数量
    const chunkTotal = this.#_chunkSize <= 0 ? 1 : Math.ceil(file.size / this.#_chunkSize);
    // 每个worker处理的chunk数量
    const taskChunkSize = Math.ceil(chunkTotal / this.#_maxConcurrent);
    const retryChunksMap = getArraySlice(chunkIdxs, this.#_maxConcurrent);

    const uploadInfo = {
      id: getRandomString(32),
      workerTotal: this.#_getUploadNeedWorkerTotal(retryChunksMap),
      customOption,
    };

    this.#_finishInfoMap[uploadInfo.id] = [];

    const runWorkerBaseData = {
      uploadInfo,
      fileUrl,
      onProgress,
      resolve,
      reject,
    };

    this.#_concurrentRunTask({
      runWorkerBaseData,
      retryChunksMap,
      taskChunkSize,
      chunkTotal,
    });
  }

  async #_createUploadTask(
    file: FileLive,
    {
      onProgress = () => {},
      chunkIdxs = [],
      customOption,
    }: { onProgress?: (progress: UploadProgressInfo) => void; chunkIdxs?: number[]; customOption?: any },
  ) {
    return new Promise<UploadFinishInfo>((resolve, reject) => {
      this.#_uploadQueue.push({
        file,
        onProgress,
        chunkIdxs,
        resolve,
        reject,
        customOption,
      });
      this.#_runTaskPreHandle();
    });
  }

  retry(file: FileLive, chunkIdxs: number[], options: UploadOptionsProp) {
    return this.#_createUploadTask(file, { ...options, chunkIdxs });
  }

  upload(file: FileLive, options?: UploadOptionsProp) {
    if (this.#_status === UPLOAD_CONTROLLER_STATUS.closed)
      return;
    return this.#_createUploadTask(file, { ...(options || {}), chunkIdxs: [] });
  }

  abort(file: FileLive) {
    const _file = this.#_uploadQueue.splice(
      this.#_uploadQueue.findIndex(item => item.file === file),
      1,
    );
    return !!_file?.length;
  }

  clear() {
    this.#_uploadQueue = [];
  }

  close() {
    this.#_status = UPLOAD_CONTROLLER_STATUS.closed;
    this.#_uploadWorkerPool.close(worker => worker.dispose());
  }
}
/**
 * @param {UploadOptions} options
 * @param {boolean} forceCreate
 */
export function createUploader(options: UploadOptions, forceCreate: boolean = false) {
  const normalizedOptions = normalizeOptions(options);
  return UploadController.getInstance(normalizedOptions, forceCreate);
}
