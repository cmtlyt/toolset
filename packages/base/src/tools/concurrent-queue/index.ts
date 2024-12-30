import { getRandomString, withResolvers } from '$/utils';

interface ConcurrentQueueOptions {
  /** 最大并发数 */
  maxConcurrent: number;
  /**
   * 是否在存在任务的时候自动执行
   * 如果为 false, 则需要手动调用 run 方法
   * @default true
   */
  autoRun: boolean;
}

function normalizeOptions(options?: Partial<ConcurrentQueueOptions>): ConcurrentQueueOptions {
  return {
    maxConcurrent: 3,
    autoRun: true,
    ...options,
  };
}

type PromiseResult<T> = T extends Promise<infer R> ? PromiseResult<R> : T;

interface TaskItem {
  id: string;
  status: 'waiting' | 'running' | 'remove';
  promise: Promise<any>;
  oriTask: () => Promise<any>;
  task: (task: TaskItem) => Promise<any>;
  resolve: (task: TaskItem, value: any) => void;
  reject: (reason?: any) => void;
  changeStatus: (task: TaskItem, status: TaskItem['status']) => void;
}

interface ExportTaskItem {
  id: string;
  status: TaskItem['status'];
  promise: TaskItem['promise'];
  task: TaskItem['task'];
}

interface AddOptions {
  return?: 'id' | 'promise';
}

interface AddOptionsWithId extends AddOptions {
  return: 'id';
}

interface FinishedInfo {
  promise: Promise<void>;
  resolve: () => void;
}

class ConcurrentQueue {
  static instanceMap: Record<string, ConcurrentQueue> = {};

  #options: ConcurrentQueueOptions;
  #queue: TaskItem[] = [];
  #running = 0;
  #runningQueue: TaskItem[] = [];
  #disposed = false;

  #_finisheInfo: FinishedInfo | null = null;

  get #status(): Promise<void> | null {
    return this.#_finisheInfo && this.#_finisheInfo.promise;
  }

  set #status(flag: 'init' | 'finished') {
    if (flag === 'finished' && this.#_finisheInfo) {
      this.#_finisheInfo.resolve();
      this.#_finisheInfo = null;
      this.status = 'finished';
      return;
    }
    // init 的时候如果是自动运行, 则状态需要调整为 running
    this.status = this.#options.autoRun ? 'running' : this.status;
    const { promise, resolve } = withResolvers<void>();
    this.#_finisheInfo = { promise, resolve };
  }

  get finished() {
    this.#disposedCheck();
    return this.#status || Promise.resolve();
  }

  /** 队列状态 */
  status: 'running' | 'finished' | 'stopped' | 'disposed' = 'stopped';
  /** 队列 id */
  id: string;

  /**
   * 获取下一个任务
   *
   * 下列情况不返回任务
   * 1. 队列无等待中的任务
   * 2. 运行中的任务数大于等于最大并发数
   * 3. 队列状态为 stopped
   */
  get #nextItem() {
    if (this.status === 'stopped')
      return;

    // 正常调用无法走到这一步, 因为 nextItem 实在同步代码中执行的
    // 获取 nextItem 也是根据最大并发数去循环, 而不是无限循环
    // 但为了代码安全, 还是保留当前代码
    if (this.#running >= this.#options.maxConcurrent)
      return;

    let task;
    // 获取下一个等待状态的任务
    do {
      task = this.#queue.shift();
      if (!task)
        return;
    } while (task.status !== 'waiting');

    this.#runningQueue.push(task);
    return task;
  }

  constructor(id: string, options?: Partial<ConcurrentQueueOptions>) {
    const _options = normalizeOptions(options);

    this.id = id;
    this.#options = _options;
  }

  #disposedCheck() {
    if (this.#disposed)
      throw new Error('queue has been disposed');
  }

  /** 运行任务 */
  #runTask() {
    const { maxConcurrent } = this.#options;
    for (let i = this.#running; i < maxConcurrent; ++i) {
      const taskItem = this.#nextItem;
      if (!taskItem) {
        // 获取不到等待的任务并且没有运行中的任务, 则标志当前队列为完成状态
        if (this.#running === 0 && this.status === 'running')
          this.#status = 'finished';
        break;
      }
      this.#running++;
      taskItem.task(taskItem).then(taskItem.resolve.bind(null, taskItem), taskItem.reject);
    }
  }

  /** 创建任务 */
  #createTask<R>(callback: () => Promise<R>): TaskItem {
    const { promise, resolve, reject } = withResolvers<R>();

    const taskConfig: TaskItem = {
      id: getRandomString(),
      promise,
      oriTask: callback,
      task: (task: TaskItem) => {
        task.status = 'running';
        return callback();
      },
      status: 'waiting',
      resolve: (task: TaskItem, result: any) => {
        const { id, status } = task;
        this.#runningQueue = this.#runningQueue.filter(item => item.id !== id);
        this.#running--;
        resolve(result);
        this.#runTask();
        if (status === 'remove')
          throw new Error(`task ${task.id} Abnormal termination`);
      },
      reject,
      changeStatus: (task, status) => {
        task.status = status;
      },
    };

    return taskConfig;
  }

  /**
   * 添加任务到队列
   * @param {() => Promise<any>} callback 任务回调
   */
  add<T extends Promise<any>, R = PromiseResult<T>>(callback: () => T): Promise<R>;
  /**
   * 添加任务到队列
   * @param callback 任务回调
   * @param {AddOptions?} options
   * @param {'id' | 'promise'} options.return 返回值类型
   * @default options = { return: 'promise' }
   */
  add<T extends Promise<any>, R = PromiseResult<T>, O extends AddOptions = AddOptions>(
    callback: () => T, options: O
  ): O extends AddOptionsWithId ? string : Promise<R>;
  add<T extends Promise<any>, R = PromiseResult<T>>(callback: () => T, options: AddOptions = { return: 'promise' }) {
    this.#disposedCheck();
    if (!this.#status)
      this.#status = 'init';
    const taskConfig = this.#createTask<R>(callback);
    this.#queue.push(taskConfig);
    this.#options.autoRun && this.#runTask();
    let { return: _return = 'promise' } = options;
    if (!['id', 'promise'].includes(_return))
      _return = 'promise';
    return taskConfig[_return];
  }

  /** 查找任务 */
  #findTask(id: string, includeRunning: boolean): TaskItem | undefined;
  #findTask(callback: () => Promise<any>, includeRunning: boolean): TaskItem | undefined;
  #findTask(flag: string | (() => Promise<any>), includeRunning: boolean) {
    const tasks = includeRunning ? [...this.#queue, ...this.#runningQueue] : this.#queue;
    if (typeof flag === 'string')
      return tasks.find(item => item.id === flag);
    return tasks.find(item => item.oriTask === flag);
  }

  /** 移除等待中的任务 */
  remove(id: string): boolean;
  remove(callback: () => Promise<any>): boolean;
  remove(flag: string | (() => Promise<any>)) {
    this.#disposedCheck();
    const task = this.#findTask(flag as string, false);
    // 运行中的无法删除
    if (!task || task?.id === 'running')
      return false;
    task.changeStatus(task, 'remove');
    return true;
  }

  clear() {
    this.#disposedCheck();
    this.#queue = [];
  }

  /** 获取任务信息 */
  getTaskInfo(id: string): ExportTaskItem | undefined;
  getTaskInfo(callback: () => Promise<any>): ExportTaskItem | undefined;
  getTaskInfo(flag: string | (() => Promise<any>)) {
    this.#disposedCheck();
    const task = this.#findTask(flag as string, true);
    if (!task)
      return;
    return {
      id: task.id,
      status: task.status,
      promise: task.promise,
      task: task.oriTask,
    };
  }

  /** 手动运行任务 (仅在状态不为 running 时有效) */
  run() {
    this.#disposedCheck();
    if (this.status === 'running')
      return;
    this.status = 'running';
    this.#runTask();
  }

  /** 停止任务 */
  stop() {
    this.#disposedCheck();
    this.status = 'stopped';
  }

  /** 卸载队列 */
  dispose() {
    this.#disposedCheck();
    this.stop();
    this.clear();
    this.status = 'disposed';
    this.#disposed = true;
    delete ConcurrentQueue.instanceMap[this.id];
  }

  get remainingCount() {
    this.#disposedCheck();
    return this.#queue.length;
  }
}

export function getAllQueueIds() {
  return Object.keys(ConcurrentQueue.instanceMap);
}

export function getConcurrentQueue(options?: Partial<ConcurrentQueueOptions>, id = 'default') {
  return ConcurrentQueue.instanceMap[id] ||= new ConcurrentQueue(id, options);
}
