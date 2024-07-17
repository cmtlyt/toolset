import { TAnyFunc, TExclude, TFlatPromise } from '../../types/base';
import { caniuse, createLinkByString, getRandomString } from '../../utils';
import { warning } from '../../common/warning';

function generateWorkerScript(func: TAnyFunc, importScript: string[] = [], userNeedPost = false) {
  return `
${importScript.length ? `importScripts("${importScript.join('", "')}");` : ''}
const func = ${func};

const { postMessage } = (()=>{
  const postMessage = (data) => {
    self.postMessage({ __clUserCall: true, data })
  };
  return { postMessage: (data) => postMessage(data) };
})();

self.onmessage = async (e) => {
  const { callId, data: args } = e.data
  try {
    const result = await func.apply(null, ${userNeedPost ? `[postMessage, ...args]` : 'args'});
    self.postMessage({ __clSysCall: true, type: 'success', result, callId });
  } catch (e) {
    self.postMessage({ __clSysCall: true, callId, type: 'error', error: e })
  }
}
self.onerror = (e) => {
  self.postMessage({ __clSysCall: true, type: 'error', error: e })
}`;
}

function createWorker(scriptUrl: string | URL) {
  const worker = new Worker(scriptUrl);
  return worker;
}

interface EventFuncs {
  on: <T>(callback: (data: T) => void) => void;
  remove: (callback: TAnyFunc) => void;
  clearOn: () => void;
  onOnce: <T>(callback: (data: T) => void) => void;
  emit: (data: any) => void;
}

export interface WorkerFuncs<F extends TAnyFunc, A extends any[] = Parameters<F>, R = ReturnType<F>>
  extends TExclude<EventFuncs, 'emit'> {
  run: (...args: A) => TFlatPromise<R>;
  dispose: () => void;
}

function createEventFunc(): EventFuncs {
  const userOnMessage = [];
  const on: EventFuncs['on'] = (callback) => {
    userOnMessage.push(callback);
  };
  const remove: EventFuncs['remove'] = (callback) => {
    userOnMessage.splice(userOnMessage.indexOf(callback), 1);
  };
  const clearOn: EventFuncs['clearOn'] = () => {
    userOnMessage.length = 0;
  };
  const onOnce: EventFuncs['onOnce'] = (callback) => {
    const onceCallback = (...args: any[]) => {
      callback.apply(null, args);
      remove(onceCallback);
    };
    on(onceCallback);
  };
  const emit: EventFuncs['emit'] = (data) => {
    for (const callback of userOnMessage) {
      callback(data);
    }
  };
  return { on, remove, clearOn, onOnce, emit };
}

interface MessageHandlerProps {
  emit: (data: any) => void;
  type: string;
  result: any;
  error: any;
  resolve: (data: any) => void;
  reject: (data: any) => void;
  isSysCall: boolean;
  eventData: any;
}

function messageHandle({
  emit,
  type,
  result,
  error,
  resolve = () => {},
  reject = () => {},
  isSysCall,
  eventData,
}: MessageHandlerProps) {
  if (isSysCall) {
    if (type === 'success') {
      resolve(result);
    } else {
      reject(error);
    }
  } else {
    const { __clUserCall, data } = eventData;
    if (__clUserCall) {
      emit(data);
    } else {
      emit(eventData);
    }
  }
}

function createWorkerFuncs(scriptUrl: string): WorkerFuncs<TAnyFunc> {
  const worker = createWorker(scriptUrl);
  let isClose = false;
  // 缓存每次调用的promise, 区分不同的调用
  // 只存不删缓存会膨胀
  let cache = {};
  const { emit, ...eventFuncs } = createEventFunc();
  // 绑定一次事件就好了
  worker.onmessage = (e) => {
    // 这还需要拿到id...
    const { type, result, error, callId, __clSysCall } = e.data;
    const { resolve, reject } = cache[callId] || {};
    if (__clSysCall) {
      // 过河拆桥
      delete cache[callId];
    }
    messageHandle({
      emit,
      type,
      result,
      error,
      resolve,
      reject,
      isSysCall: __clSysCall,
      eventData: e.data,
    });
  };
  const run = async (...args: any[]) => {
    if (isClose) throw new Error('worker资源已释放');
    // 生成调用id
    const id = getRandomString(16);
    return new Promise((resolve, reject) => {
      cache[id] = { resolve, reject };
      // 每次调用的id用事件传递就好了
      worker.postMessage({ callId: id, data: args });
    });
  };
  // 这个是复用的,就需要释放被复用的worker了,但是...url
  const dispose = () => {
    worker.terminate();
    cache = null;
    isClose = true;
    URL.revokeObjectURL(scriptUrl);
  };
  return { run, dispose, ...eventFuncs };
}

function createOnceWorkerFuncs(scriptUrl: string): WorkerFuncs<TAnyFunc> {
  let isClose = false;
  const { emit, ...eventFuncs } = createEventFunc();
  const run = async (...args: any[]) => {
    if (isClose) throw new Error('worker资源已释放');
    const worker = createWorker(scriptUrl);
    return new Promise((resolve, reject) => {
      // 反正每次都会创建一个新的,没必要管多次调用之间的冲突
      worker.onmessage = (e) => {
        const { type, result, error, __clSysCall } = e.data;
        if (__clSysCall) {
          worker.terminate();
        }
        messageHandle({
          emit,
          type,
          result,
          error,
          resolve,
          reject,
          isSysCall: __clSysCall,
          eventData: e.data,
        });
      };
      worker.postMessage({ data: args });
    });
  };
  // 那好像每次都清除了worker dispose没啥必要啊
  const dispose = () => {
    isClose = true;
    URL.revokeObjectURL(scriptUrl);
  };
  return { run, dispose, ...eventFuncs };
}

function formatImportScripts(input: (string | TAnyFunc)[]): string[] {
  const funcs: TAnyFunc[] = [];
  const strs: string[] = [];
  input.forEach((item) => {
    if (typeof item === 'string') strs.push(item);
    else if (typeof item === 'function') funcs.push(item);
  });
  strs.push(
    createLinkByString(
      funcs
        .map((func) => {
          return `function ${func.name}(...args) { return (${func})(...args); }`;
        })
        .join('\n'),
    ),
  );
  return strs;
}

interface CreateWorkerFuncOptions {
  reuse?: boolean;
  needPost?: boolean;
}

export function createWorkerFunc<F extends TAnyFunc>(
  func: F,
  importScripts: (string | TAnyFunc)[] = [],
  options?: CreateWorkerFuncOptions,
): WorkerFuncs<F> {
  if (!caniuse('Worker')) {
    warning('不支持 web worker 已降级');
    return {
      run: (async (...args: any[]) => {
        return await func(...args);
      }) as TAnyFunc,
      dispose: () => {},
      ...createEventFunc(),
    };
  }
  const { reuse = true, needPost = false } = options;
  const workerScript = generateWorkerScript(func, formatImportScripts(importScripts), needPost);
  const scriptUrl = createLinkByString(workerScript);
  // 复用版的funcs
  if (reuse) {
    const workerFunc = createWorkerFuncs(scriptUrl);
    return workerFunc;
  }
  // 不需要复用的话每次都要创建一个新的worker
  const workerOnceFunc = createOnceWorkerFuncs(scriptUrl);
  return workerOnceFunc;
}
