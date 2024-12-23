import type { TObject } from '@cmtlyt/base';
import { getStore, logCache } from '../store';
import { getTargetSelector } from '../util';

const eventMap: TObject<(event: Event) => void> = {};

const defaultEventList: (keyof WindowEventMap)[] = ['click'];

export function initEventListener(root: HTMLElement | Window = window, eventList?: (keyof WindowEventMap)[], needListenerCapture = false) {
  (eventList || defaultEventList).forEach((eventName) => {
    const getCallback = (extendObj: TObject<any>) => {
      return (eventMap[eventName] = (event: Event) => {
        logCache.push({
          kind: 'event',
          message: eventName,
          extra: { timestamp: Date.now(), event, isCapture: needListenerCapture, selector: getTargetSelector(event.target as HTMLElement) },
          ...extendObj,
        });
      });
    };

    needListenerCapture && root.addEventListener(eventName, getCallback({ capture: true }), { capture: true });
    root.addEventListener(eventName, getCallback({ capture: false }));
  });
}

// 取消注册
window.addEventListener(
  'unload',
  () => {
    const { rootElement } = getStore('monitorConfig');
    for (const event in eventMap) {
      rootElement.removeEventListener(event, eventMap[event], { capture: true });
      rootElement.removeEventListener(event, eventMap[event]);
    }
  },
  { once: true },
);
