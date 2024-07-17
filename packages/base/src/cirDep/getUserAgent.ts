import { cacheByReturn } from './funcHandler';

export const getUserAgent = cacheByReturn((): string => {
  if (globalThis.navigator) {
    // @ts-expect-error env
    return globalThis.navigator.userAgent || globalThis.navigator.swuserAgent;
  } else if (process) {
    return `Node.js/${process.version} (${process.platform}; ${process.arch}) ${process.env.SHELL} ${process.env.LANG} ${process.env.TERM_PROGRAM}`;
  }
  return '';
});
