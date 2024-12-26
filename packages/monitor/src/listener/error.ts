import { logCache, putEventMap } from '../store';

function errorHandler(event: ErrorEvent) {
  logCache.push({ kind: 'systemError', message: event.message, extra: { timestamp: Date.now() } });
}

function unhandledrejectionHandler(event: PromiseRejectionEvent) {
  logCache.push({ kind: 'systemError', message: event.reason.toString(), extra: { timestamp: Date.now() } });
}

export function initErrorListener() {
  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', unhandledrejectionHandler);
  putEventMap('error', errorHandler as any);
  putEventMap('unhandledrejection', unhandledrejectionHandler as any);
}
