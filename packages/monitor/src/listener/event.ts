import { TObject } from '@cmtlyt/base';

import { logCache } from '../store';
import { getTargetSelector } from '../util';

const eventMap = {};

const defaultEventList: (keyof WindowEventMap)[] = ['click'];

export function initEventListener(eventList?: (keyof WindowEventMap)[], needListenerCapture?: boolean) {
  (eventList || defaultEventList).forEach((event) => {
    const getCallback = (extendObj: TObject<any>) => {
      return (eventMap[event] = (event: Event) => {
        console.log(event, getTargetSelector(event.target as HTMLElement));
        logCache.push({ kind: 'event', message: 'click', extra: { timestamp: Date.now(), event, ...extendObj } });
      });
    };

    needListenerCapture && window.addEventListener(event, getCallback({ capture: true }), { capture: true });
    window.addEventListener(event, getCallback({ capture: false }));
  });
}

// 取消注册
window.addEventListener(
  'unload',
  () => {
    for (const event in eventMap) {
      window.removeEventListener(event, eventMap[event], { capture: true });
      window.removeEventListener(event, eventMap[event]);
    }
  },
  { once: true },
);
