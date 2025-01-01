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

describe.runIf(inject('CI'))('其他测试', async () => {
  const { createMonitor } = await (() => {
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

  const logs: any[] = [];
  let currIdx = 0;
  const container = render();
  const performanceInfos: any[] = [];
  createMonitor({
    rootElement: container,
    listenerEvents: ['click', 'dblclick'],
    needListenerCapture: true,
    loggerOptions: {
      noOutput: true,
      logConfig: {
        event: { inherit: 'info', kind: 'event' },
        system: { inherit: 'info', kind: 'system' },
      },
    },
    formatLogInfo: (info) => {
      if (info.logInfo.kind === 'system') {
        performanceInfos.push(info.logInfo);
        return info;
      }
      return info;
    },
    reportStrategy: (info: any) => info.logInfo.kind !== 'system',
    formatReportInfo: (info: any) => info.logInfo.kind !== 'system' ? info.logInfo : stringify(info, ['rootElement']),
    reportLog: info => logs[currIdx++] = info,
  });

  it('capture 测试', async () => {
    const totalLogs = logs.length;
    await userEvent.click(page.getByRole('button', { name: 'click test', exact: true }));
    expect(logs.length - 2).toBeGreaterThanOrEqual(totalLogs);
    expect(logs.some(item => item.messages[1]?.isCapture)).toBe(true);
  });

  it('container out click', async () => {
    const totalLogs = logs.length;
    await userEvent.click(page.getByText('out container'));
    expect(logs.length).toBe(totalLogs);
  });

  it('performance 测试', () => {
    expect(performanceInfos.length).toBeGreaterThanOrEqual(0);
    performanceInfos.forEach((info) => {
      expect(info.messages[0]).toBe('performanceInfo');
      const pinfo = info.messages[1] as any;
      expect(pinfo.delta).toBeTypeOf('number');
      expect(pinfo.timestamp).toBeTypeOf('number');
      expect(pinfo.name).toBeTypeOf('string');
      expect(pinfo.navigationType).toBeTypeOf('string');
      expect(pinfo.rating).toBeTypeOf('string');
      expect(pinfo.value).toBeTypeOf('number');
    });
  });
});
