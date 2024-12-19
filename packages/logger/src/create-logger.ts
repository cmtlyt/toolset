import type { Kind, Logger, LoggerConfigObj, LoggerOptions } from './types';
import { LogThrow } from './types';
import { generateLoggerConfig, generateMessage } from './utils/generate';

const confMap = new WeakMap<object, { userOption: LoggerOptions; conf: LoggerConfigObj }>();

function messageCatch(error: LogThrow) {
  switch (error) {
    case LogThrow.PREVENT_DEFAULT:
    case LogThrow.NO_OUTPUT:
      break;
    default:
      error satisfies never;
      throw error;
  }
}

const handler: ProxyHandler<Logger> = {
  get(target, key: Kind, _receiver) {
    const { userOption = {}, conf: curConf } = confMap.get(target) || {};
    if (!curConf)
      throw new Error('illegal call');

    // eslint-disable-next-line no-console
    const { getPrintFunc = () => console.log, printFunc } = userOption || {};

    const finishedPrintFunc = printFunc || getPrintFunc.call(target as LoggerOptions, key);

    if (!(key in curConf)) {
      console.warn(`not found [${key}] logConfig, please add logConfig, currently using log replacement`);
    }
    const logConf = curConf[key] || { ...curConf.info, kind: key };
    return (...args: unknown[]) => {
      try {
        const message = generateMessage(target as LoggerOptions, logConf, ...args);
        finishedPrintFunc?.(...message);
      }
      catch (e) {
        messageCatch(e as LogThrow);
      }
    };
  },
};

export function createLogger<T extends string, E = unknown>(
  options?: LoggerOptions<T, E>,
): Logger & Record<T, (...args: unknown[]) => void> {
  const { logConfig } = options || {};
  const userLogConf = { ...options };
  const conf = generateLoggerConfig(logConfig);
  confMap.set(userLogConf, { userOption: userLogConf as unknown as LoggerOptions, conf });
  return new Proxy<Logger>(userLogConf as unknown as Logger, handler) as any;
}

export const logger = createLogger();
