import { describe, expect, it } from 'vitest';
import { getAllQueueIds, getConcurrentQueue } from '../src';

describe('concurrent-queue', () => {
  const sleep = async (t: number): Promise<number> => new Promise(r => setTimeout(() => r(t), t));

  it('应该符合单例逻辑', () => {
    const queue = getConcurrentQueue();
    const queue2 = getConcurrentQueue({ maxConcurrent: 3 });
    expect(queue).toBe(queue2);
  });

  it('添加任务应该返回一个 Promise 并正常执行', async () => {
    const queue = getConcurrentQueue();
    const result = await queue.add(() => Promise.resolve(1));
    expect(result).toBe(1);
  });

  it('默认并发 3 个, 添加 5 个任务应按预期执行', async () => {
    const queue = getConcurrentQueue({}, '并发测试');
    const promises: Promise<any>[] = [];
    const result: number[] = [];

    promises.push(queue.add(() => sleep(100)).then(r => result.push(r)));
    promises.push(queue.add(() => sleep(300)).then(r => result.push(r)));
    promises.push(queue.add(() => sleep(150)).then(r => result.push(r)));
    promises.push(queue.add(() => sleep(100)).then(r => result.push(r)));
    promises.push(queue.add(() => sleep(120)).then(r => result.push(r)));

    await Promise.all(promises);

    // 100 300 150 - 100 120
    // 0   200  50 100 - 120
    // 0   150   0  50   120
    // 0   100   0   0    70
    // 0    30   0   0     0
    // 0     0   0   0     0
    // 100 150 100 120 300

    expect(JSON.stringify(result)).toMatchInlineSnapshot(`"[100,150,100,120,300]"`);
  });

  it('移除等待中的任务', async () => {
    const queue = getConcurrentQueue({ maxConcurrent: 1 }, '移除测试');
    const promises: Promise<any>[] = [];
    const result: number[] = [];

    const task1 = () => sleep(100);
    promises.push(queue.add(task1).then(r => result.push(r)));
    const task2 = () => sleep(200);
    queue.add(task2).then(r => result.push(r));
    const id = queue.add(() => sleep(50), { return: 'id' });
    promises.push(queue.add(() => sleep(150), {}).then(r => result.push(r)));

    expect(queue.remove(task1)).toBe(false);
    expect(queue.remove(id)).toBe(true);
    expect(queue.remove(task2)).toBe(true);
    await Promise.all(promises);

    expect(JSON.stringify(result)).toMatchInlineSnapshot(`"[100,150]"`);
  });

  it('获取任务状态', async () => {
    const queue = getConcurrentQueue({ maxConcurrent: 1 }, '获取任务状态');
    const id = queue.add(() => sleep(100), { return: 'id' });
    const task2 = () => sleep(100);
    // @ts-expect-error 测试用例
    expect(queue.add(task2, { return: 'ccc' })).toBeInstanceOf(Promise);
    const taskInfo = queue.getTaskInfo(id)!;
    expect(taskInfo.id).toBeTypeOf('string');
    expect(taskInfo.status).toBe('running');
    expect(taskInfo.promise).toBeInstanceOf(Promise);
    const taskInfo2 = queue.getTaskInfo(task2)!;
    expect(taskInfo2.id).toBeTypeOf('string');
    expect(taskInfo2.status).toBe('waiting');
    expect(taskInfo2.promise).toBeInstanceOf(Promise);
    queue.remove(task2);
    const taskInfo3 = queue.getTaskInfo(task2)!;
    expect(taskInfo3.id).toBeTypeOf('string');
    expect(taskInfo3.status).toBe('remove');
    expect(taskInfo3.promise).toBeInstanceOf(Promise);
    const taskInfo4 = queue.getTaskInfo('123')!;
    expect(taskInfo4).toBeUndefined();
  });

  it('队列状态转换', async ({ expect }) => {
    const queue = getConcurrentQueue({ maxConcurrent: 1, autoRun: false }, '队列状态转换');
    const result: string[] = [];
    expect(queue.status).toBe('stopped');
    expect(queue.finished).toBeInstanceOf(Promise);
    await queue.finished;
    expect(queue.status).toBe('stopped');
    const task1 = queue.add(() => sleep(100));
    expect(queue.status).toBe('stopped');
    expect(queue.remainingCount).toBe(1);
    queue.add(() => sleep(100));
    queue.add(() => sleep(20)).then(() => result.push('task3'));
    expect(queue.remainingCount).toBe(3);
    expect(queue.finished).toBeInstanceOf(Promise);

    queue.run();
    queue.run();
    expect(queue.status).toBe('running');
    queue.stop();
    expect(queue.status).toBe('stopped');
    expect(queue.remainingCount).toBe(2);

    await task1;

    queue.run();
    expect(queue.remainingCount).toBe(1);
    queue.clear();

    await queue.finished;
    expect(queue.status).toBe('finished');

    expect(JSON.stringify(result)).toMatchInlineSnapshot(`"[]"`);
  });

  it('队列 dispose', () => {
    const queue = getConcurrentQueue({}, 'dispose');
    const queue2 = getConcurrentQueue({}, 'dispose');
    expect(queue).toBe(queue2);
    queue.dispose();
    const queue3 = getConcurrentQueue({}, 'dispose');
    expect(queue).not.toBe(queue3);
    queue3.dispose();
    expect(getAllQueueIds()).not.include(queue3.id);
    expect(() => queue.add(async () => {})).toThrow(Error);
    expect(() => queue.clear()).toThrow(Error);
    expect(() => queue.dispose()).toThrow(Error);
    expect(() => queue.getTaskInfo('')).toThrow(Error);
    expect(() => queue.remove('')).toThrow(Error);
    expect(() => queue.run()).toThrow(Error);
    expect(() => queue.stop()).toThrow(Error);
    expect(() => queue.finished).toThrow(Error);
    expect(queue.status).toBe('disposed');
    expect(() => queue3.add(async () => {})).toThrow(Error);
  });
});
