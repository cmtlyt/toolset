import { page, userEvent } from '@vitest/browser/context';
import { describe, expect, inject, it } from 'vitest';
import { render } from './render-dom';

function stringify(obj: any, ignoreKey: string[] = []) {
  try {
    return JSON.stringify(obj, (key, value) => ignoreKey.includes(key) ? void 0 : value);
  }
  catch {
    return '';
  }
}

describe.runIf(inject('CI'))('monitor', async () => {
  const { createMonitor } = await (() => {
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

  const logs: any[] = [];
  let currIdx = 0;
  render();
  const logger = createMonitor({
    listenEventConfig: { events: ['click', 'dblclick'] },
    loggerOptions: {
      noOutput: true,
      logConfig: {
        event: { inherit: 'info', kind: 'event' },
        system: { inherit: 'info', kind: 'system' },
      },
    },
    reportStrategy: (info: any) => info.logInfo.kind !== 'system',
    formatReportInfo: (info: any) => info.logInfo.kind !== 'system' ? info.logInfo : stringify(info, ['rootElement']),
    reportLog: info => logs[currIdx++] = info,
  });

  it('custom logger', () => {
    const idx = currIdx;
    expect(logs[idx]).toMatchInlineSnapshot(`undefined`);
    logger.event('custom event', { test: 1 });
    expect(stringify(logs[idx])).toMatchInlineSnapshot(`"{"kind":"event","messages":["custom event",{"test":1}],"logConf":{"inherit":"info","kind":"event","tagColor":"#000","tagBg":"#d9d9d9","contentColor":"#000","contentBg":"#fff","borderColor":"#d9d9d9"}}"`);
  });

  it('事件监听测试', async () => {
    const idx = currIdx;
    await userEvent.click(page.getByRole('button', { name: 'click test', exact: true }));
    const clickLog = logs[idx];
    expect(clickLog.kind).toBe('event');
    expect(stringify(clickLog.logConf)).toMatchInlineSnapshot(`"{"inherit":"info","kind":"event","tagColor":"#000","tagBg":"#d9d9d9","contentColor":"#000","contentBg":"#fff","borderColor":"#d9d9d9"}"`);
    expect(clickLog.messages[0]).toBe('click');
    const logInfo = clickLog.messages[1] as any;
    expect(logInfo.isCapture).toBe(false);
    expect(logInfo.selector).toMatchInlineSnapshot(`"body>div:nth-child(1)>.btn-box>.click-test"`);
    expect(logInfo.timestamp).toBeTypeOf('number');
  });

  it('同步错误测试', async () => {
    const idx = currIdx;
    await userEvent.click(page.getByRole('button', { name: 'sync error test', exact: true }));
    const errorLog = logs[idx];
    expect(stringify(errorLog.logConf)).toMatchInlineSnapshot(`"{"kind":"systemError","tagColor":"#000","tagBg":"#d9d9d9","contentColor":"#000","contentBg":"#fff","borderColor":"#d9d9d9"}"`);
    expect(errorLog.messages[0]).toBe('Uncaught Error: sync error test');
    const logInfo = errorLog.messages[1] as any;
    expect(logInfo.timestamp).toBeTypeOf('number');
  });

  it('双击测试', async () => {
    await userEvent.dblClick(page.getByRole('button', { name: 'dblclick test', exact: true }));
    const dblclickLog = logs.find(log => log.messages[0] === 'dblclick');
    expect(dblclickLog).toBeTruthy();
    expect(dblclickLog.kind).toBe('event');
    expect(stringify(dblclickLog.logConf)).toMatchInlineSnapshot(`"{"inherit":"info","kind":"event","tagColor":"#000","tagBg":"#d9d9d9","contentColor":"#000","contentBg":"#fff","borderColor":"#d9d9d9"}"`);
    const logInfo = dblclickLog.messages[1] as any;
    expect(logInfo.isCapture).toBe(false);
    expect(logInfo.selector).toMatchInlineSnapshot(`"#dblclick-test>.dblclick-test-span"`);
    expect(logInfo.timestamp).toBeTypeOf('number');
  });

  it('异步错误测试', async () => {
    await userEvent.click(page.getByRole('button', { name: 'async error test', exact: true }));
    const errorLog = logs.find(item => item.kind === 'systemError' && item.messages[0] === 'async error test');
    expect(stringify(errorLog.logConf)).toMatchInlineSnapshot(`"{"kind":"systemError","tagColor":"#000","tagBg":"#d9d9d9","contentColor":"#000","contentBg":"#fff","borderColor":"#d9d9d9"}"`);
    expect(errorLog.messages[0]).toMatchInlineSnapshot(`"async error test"`);
    const logInfo = errorLog.messages[1] as any;
    expect(logInfo.timestamp).toBeTypeOf('number');
  });
});
