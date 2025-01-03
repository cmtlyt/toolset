import type { ListenEventConfig } from '$/type';
import type { TObject } from '@cmtlyt/base';
import { eventMap, getStore, logCache, putEventMap, setStore } from '../store';
import { getTargetSelector } from '../util';

const defaultEventList: (keyof WindowEventMap)[] = ['click'];

export function initEventListener(root: HTMLElement | Window = window, options: ListenEventConfig<any>) {
  const config = getStore('monitorConfig');
  const { events = defaultEventList, needListenCapture = false, generateExtra } = options;

  (events || defaultEventList).forEach((eventName) => {
    const getCallback = (extendObj: TObject<any>) => {
      const callback = (event: Event) => {
        const systemExtra = {
          timestamp: Date.now(),
          isCapture: needListenCapture,
          selector: getTargetSelector(event.target as HTMLElement),
        };
        const userExtra = typeof generateExtra === 'function' ? generateExtra.call(config, { event, systemExtra }) : {};

        logCache.push({
          kind: 'event',
          message: eventName,
          extra: {
            ...systemExtra,
            ...userExtra,
          },
          ...extendObj,
        });
      };
      putEventMap(eventName, callback);
      return callback;
    };

    needListenCapture && root.addEventListener(eventName, getCallback({ capture: true }), { capture: true });
    root.addEventListener(eventName, getCallback({ capture: false }));
  });
}

// 取消注册
window.addEventListener(
  'unload',
  () => {
    setStore('isUnload', true);
    const { rootElement } = getStore('monitorConfig');
    for (const event in eventMap) {
      rootElement.removeEventListener(event, eventMap[event], { capture: true });
      rootElement.removeEventListener(event, eventMap[event]);
      window.removeEventListener(event, eventMap[event], { capture: true });
      window.removeEventListener(event, eventMap[event]);
    }
  },
  { once: true },
);
