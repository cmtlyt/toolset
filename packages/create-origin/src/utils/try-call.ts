import path from 'node:path';
import process from 'node:process';
import { ICON_MAP, TEMPLATE_STORE_FOLDER_NAME } from '$/constant';
import { getItem } from '$/store';
import fsExtra from 'fs-extra/esm';
import { colorize } from './colorize';
import { print } from './print';

export function throwError(message: string) {
  print('\n', colorize`{red ${ICON_MAP.error} ${message}}`);
  process.exit(1);
}

export async function tryCall(func: () => Promise<void>) {
  try {
    await func();
  }
  catch (e) {
    const err = e as Error;
    const { outputPath } = getItem('projectConfig');

    print(err);
    throwError(err.message);
    fsExtra.removeSync(path.resolve(outputPath, TEMPLATE_STORE_FOLDER_NAME));
  }
}
