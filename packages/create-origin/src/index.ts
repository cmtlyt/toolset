import type { ProjectConfig } from './types';
import path from 'node:path';
import process from 'node:process';
import fsExtra from 'fs-extra';
import yoctoSpinner from 'yocto-spinner';
import { ICON_MAP, TEMPLATE_STORE_FOLDER_NAME } from './constant';
import { setItem } from './store';
import { buildTemplate, downloadTemplates } from './template-system';
import { Builder, Frame, PackageManager, Registry } from './types';
import { colorize } from './utils/colorize';
import { filterObject } from './utils/filter-object';

function buildConfig(config: Partial<ProjectConfig>): ProjectConfig {
  const { projectName } = config;
  const outputPath = path.resolve(process.cwd(), projectName || '.');

  const filteredConfig: Partial<ProjectConfig> = filterObject(config);

  return {
    projectName: projectName === '.' || !projectName ? path.dirname(outputPath) : projectName,
    autoInstall: false,
    builderId: Builder.vite,
    enableEslint: true,
    enablePrettier: false,
    enableTypeScript: true,
    frameId: Frame.react,
    packageManager: PackageManager.npm,
    useLatestPackage: false,
    registry: Registry.github,
    ...filteredConfig,
    outputPath,
  };
}

async function dirCheckIsEmpty(targetPath: string): Promise<boolean> {
  const exists = await fsExtra.pathExists(targetPath);
  if (!exists)
    return true;
  const files = await fsExtra.readdir(targetPath);
  return files.length === 0;
}

export async function createProject(config: Partial<ProjectConfig>) {
  const projectConfig = buildConfig(config);
  setItem('projectConfig', projectConfig);
  const { outputPath } = projectConfig;
  try {
    const isEmpty = await dirCheckIsEmpty(outputPath);
    if (!isEmpty) {
    // eslint-disable-next-line no-console
      console.log(colorize`{red ${ICON_MAP.error} 项目目录不为空}`);
      process.exit(1);
    }
    // 创建模板存储目录 (同时会创建项目目录)
    await fsExtra.mkdir(path.resolve(outputPath, TEMPLATE_STORE_FOLDER_NAME), { recursive: true });
    const spinner = yoctoSpinner({ text: '下载模板中' }).start();
    // 下载模板
    await downloadTemplates();
    spinner.text = '生成模板中';
    // 生成模板
    await buildTemplate();
    spinner.success();
    // eslint-disable-next-line no-console
    console.log(colorize`{green ${ICON_MAP.success} ${projectConfig.projectName} 生成成功}`);
  }
  catch (e) {
    const err = e as Error;
    // eslint-disable-next-line no-console
    console.log(colorize`{red ${ICON_MAP.error} ${err.message}}`);
    process.exit(1);
  }
  // 删除模板存储目录
  await fsExtra.rm(path.resolve(outputPath, TEMPLATE_STORE_FOLDER_NAME), { recursive: true });
}
