import { logCache } from '../store';

export function initErrorListener() {
  window.addEventListener('error', (event) => {
    logCache.push({ kind: 'error', message: event.message, extra: { timestamp: Date.now(), event } });
  });
  window.addEventListener('unhandledrejection', (event) => {
    logCache.push({ kind: 'error', message: event.reason.toString(), extra: { timestamp: Date.now(), event } });
  });
}
