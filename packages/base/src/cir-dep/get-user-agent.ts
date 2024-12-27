import { cacheByReturn } from './func-handler';

export const getUserAgent = cacheByReturn((): string => {
  if (globalThis.navigator) {
    // @ts-expect-error env
    return globalThis.navigator.userAgent || globalThis.navigator.swuserAgent;
  }
  // eslint-disable-next-line node/prefer-global/process
  else if (process) {
  // eslint-disable-next-line node/prefer-global/process
    return `Node.js/${process.version} (${process.platform}; ${process.arch}) ${process.env.SHELL} ${process.env.LANG} ${process.env.TERM_PROGRAM}`;
  }
  return '';
});
