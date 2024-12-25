import type { TObject } from '@cmtlyt/base';
import { eventMap, getStore, logCache, putEventMap, setStore } from '../store';
import { getTargetSelector } from '../util';

const defaultEventList: (keyof WindowEventMap)[] = ['click'];

export function initEventListener(root: HTMLElement | Window = window, eventList?: (keyof WindowEventMap)[], needListenerCapture = false) {
  (eventList || defaultEventList).forEach((eventName) => {
    const getCallback = (extendObj: TObject<any>) => {
      const callback = (event: Event) => {
        logCache.push({
          kind: 'event',
          message: eventName,
          extra: { timestamp: Date.now(), isCapture: needListenerCapture, selector: getTargetSelector(event.target as HTMLElement) },
          ...extendObj,
        });
      };
      putEventMap(eventName, callback);
      return callback;
    };

    needListenerCapture && root.addEventListener(eventName, getCallback({ capture: true }), { capture: true });
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
