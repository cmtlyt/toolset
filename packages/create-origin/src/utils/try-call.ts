import process from 'node:process';
import { ICON_MAP } from '$/constant';
import { colorize } from './colorize';

export function throwError(message: string) {
  // eslint-disable-next-line no-console
  console.log(colorize`{red ${ICON_MAP.error} ${message}}`);
  process.exit(1);
}

export async function tryCall(func: () => Promise<void>) {
  try {
    await func();
  }
  catch (e) {
    const err = e as Error;
    throwError(err.message);
  }
}
