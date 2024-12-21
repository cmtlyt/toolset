/* eslint-disable */
// @ts-nocheck
import { createMonitor } from '../src';

setTimeout(() => {
  const logger = createMonitor<'appear', { store: any[] }>({
    loggerOptions: {
      logConfig: {
        event: { inherit: 'info', kind: 'event', needTrace: true },
        system: { inherit: 'info', kind: 'system' },
        appear: { inherit: 'info', kind: 'appear' },
      },
    },
    listenerEvents: ['click', 'dblclick'],
    needListenerCapture: true,
    store: [],
    formatLogInfo(info) {
      console.log('formatLogInfo', info);
      this.store.push(info);
      return 123;
    },
    reportStrategy(info) {
      const flag = Math.random();
      console.log('reportStrategy', info, flag, flag > 0.5);
      return flag > 0.5;
    },
    reportLog(info) {
      console.log('reportLog', info, this.store);
      this.store = [];
    },
  });
  logger.appear('page appear');
  $('#custom-error-test').addEventListener('click', () => {
    logger.event('click test');
  });
});

const $ = (id: string) => document.querySelector<HTMLElement>(`${id}`);
$('.click-test').addEventListener('click', () => {});
$('#dblclick-test').addEventListener('dblclick', () => {});
$('#auto-sync-error-test').addEventListener('click', () => {
  throw new Error('sync error test');
});
$('#auto-async-error-test').addEventListener('click', () => {
  new Promise((resolve, reject) => {
    reject('async error test');
  });
});

throw new Error('123');
