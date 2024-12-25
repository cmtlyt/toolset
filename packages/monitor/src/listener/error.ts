import { logCache, putEventMap } from '../store';

function errorHandler(event: ErrorEvent) {
  logCache.push({ kind: 'error', message: event.message, extra: { timestamp: Date.now(), event } });
}

function unhandledrejectionHandler(event: PromiseRejectionEvent) {
  logCache.push({ kind: 'error', message: event.reason.toString(), extra: { timestamp: Date.now(), event } });
}

export function initErrorListener() {
  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', unhandledrejectionHandler);
  putEventMap('error', errorHandler as any);
  putEventMap('unhandledrejection', unhandledrejectionHandler as any);
}
