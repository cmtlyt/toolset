import type { OriginConfig, ProjectConfig } from '$/types';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { Builder, Frame, Registry } from '$/types';
import gitDown from '@cmtlyt/git-down';
import fsExtra from 'fs-extra/esm';
import { colorize } from './colorize';
import { print } from './print';
import { throwError } from './try-call';

const USER_HOME = os.homedir();

const DATASTORE_PATH = (() => {
  switch (process.platform) {
    case 'darwin':
      return path.resolve(USER_HOME, 'Library/Application Support/@cmtlyt/origin');
    case 'win32':
      return path.resolve(USER_HOME, 'AppData/Local/@cmtlyt/origin');
    case 'linux':
      return path.resolve(USER_HOME, '.config/@cmtlyt/origin');
  }
  return path.resolve(USER_HOME, './@cmtlyt/origin');
})();

fsExtra.ensureDirSync(DATASTORE_PATH);

const CONFIG_OUTPUT = path.resolve(DATASTORE_PATH, 'origin-system-config.json');

const USER_TEMPLATE_CONFIG_OUTPUT = path.resolve(DATASTORE_PATH, 'user-template-config.json');

const TEMPLATE_STORE_FOLDER_NAME = path.resolve(DATASTORE_PATH, 'template');

/** 构建器支持的框架 */
const FRAME_SUPPORT: Record<Builder, Frame[]> = {
  [Builder.vite]: [Frame.vue, Frame.react, Frame.reactSwc, Frame.preact, Frame.svelte, Frame.solid],
  [Builder.webpack]: [],
  [Builder.rolldown]: [],
  [Builder.rsbuild]: [Frame.react, Frame.vue, Frame.solid, Frame.preact, Frame.svelte],
};

/** 模板的下载目录 */
const TEMPLATE_ORIGIN_PATH_MAP: Record<Registry, string> = {
  [Registry.gitee]: '',
  [Registry.github]: import.meta.BUILD ? 'https://github.com/cmtlyt/toolset/blob/main/packages/create-origin/template' : './template',
};

async function getLoacalOriginConfig(): Promise<OriginConfig> {
  if (fsExtra.pathExistsSync(CONFIG_OUTPUT)) {
    return fsExtra.readJSON(CONFIG_OUTPUT);
  }
  return {
    FRAME_SUPPORT,
    TEMPLATE_ORIGIN_PATH_MAP,
  };
}

export async function fetchOriginConifg() {
  return gitDown('https://github.com/cmtlyt/toolset/blob/main/packages/create-origin/template/origin-system-config/origin-system-config.json', { output: path.dirname(CONFIG_OUTPUT) });
}

export const getOriginConfig = (() => {
  let originConfig: OriginConfig;

  return async (readLoacl?: boolean): Promise<OriginConfig> => {
    if (originConfig)
      return originConfig;
    if (!import.meta.BUILD) {
      // 开发环境直接返回本地配置
      return originConfig ||= await getLoacalOriginConfig();
    }
    if (readLoacl) {
      // 读取本地配置
      return originConfig ||= await getLoacalOriginConfig();
    }
    // 读取线上配置
    try {
      await fetchOriginConifg();
    }
    catch {
      print(colorize`{yellow 读取线上配置失败，使用本地配置, 兜底}`);
      return originConfig ||= await getLoacalOriginConfig();
    }
    return originConfig ||= await fsExtra.readJSON(CONFIG_OUTPUT);
  };
})();

export async function getUserTemplateConfig(): Promise<Record<string, ProjectConfig>> {
  if (!fsExtra.pathExistsSync(USER_TEMPLATE_CONFIG_OUTPUT))
    return {};
  return fsExtra.readJSON(USER_TEMPLATE_CONFIG_OUTPUT);
}

export async function addUserTemplateConfig(name: string, config: Partial<ProjectConfig>) {
  const userTemplateConfig = await getUserTemplateConfig();
  return fsExtra.writeJSON(USER_TEMPLATE_CONFIG_OUTPUT, { ...userTemplateConfig, [name]: config });
}

export async function deleteUserTemplateConfig(name?: string) {
  if (!name)
    return fsExtra.writeJSON(USER_TEMPLATE_CONFIG_OUTPUT, {});
  const userTemplateConfig = await getUserTemplateConfig();
  delete userTemplateConfig[name];
  return fsExtra.writeJSON(USER_TEMPLATE_CONFIG_OUTPUT, userTemplateConfig);
}

export function downloadTemplateExists() {
  try {
    return fsExtra.pathExistsSync(TEMPLATE_STORE_FOLDER_NAME);
  }
  catch {
    return false;
  }
}

export function getTemplateStorePath() {
  return TEMPLATE_STORE_FOLDER_NAME;
}

export async function downloadTemplate(registry: Registry) {
  const templateOriginPath = TEMPLATE_ORIGIN_PATH_MAP[registry];
  if (!templateOriginPath) {
    throwError('模板源不存在');
  }
  await gitDown(templateOriginPath, { output: path.dirname(TEMPLATE_STORE_FOLDER_NAME) });
}
