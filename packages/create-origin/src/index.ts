import type { CallOption, ProjectConfig } from './types';
import path from 'node:path';
import process from 'node:process';
import gitDown from '@cmtlyt/git-down';
import fsExtra from 'fs-extra';
import yoctoSpinner from 'yocto-spinner';
import { ICON_MAP, NPM_PACKAGE_TEMPLATE_URL, TEMPLATE_STORE_FOLDER_NAME } from './constant';
import { setItem } from './store';
import { buildTemplate, downloadTemplates } from './template-system';
import { Builder, Frame, PackageManager, Registry } from './types';
import { colorize } from './utils/colorize';
import { filterObject } from './utils/filter-object';
import { downloadTemplateExists, getOriginConfig } from './utils/origin-config';
import { print } from './utils/print';
import { throwError, tryCall } from './utils/try-call';

export { Builder, Frame, PackageManager, Registry };

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
    noGit: false,
    ...filteredConfig,
    outputPath,
    isPackage: false,
  };
}

async function dirCheckIsEmpty(targetPath: string): Promise<boolean> {
  const exists = await fsExtra.pathExists(targetPath);
  if (!exists)
    return true;
  const files = await fsExtra.readdir(targetPath);
  if (files.length !== 0) {
    throwError('项目目录不为空');
    return false;
  }
  return true;
}

export async function createProject(config: Partial<ProjectConfig>, option?: CallOption) {
  setItem('callOption', option || {});

  const projectConfig = buildConfig(config);
  setItem('projectConfig', projectConfig);
  const originConfig = await getOriginConfig();
  setItem('originConfig', originConfig);
  const localExistsTemplate = downloadTemplateExists();
  setItem('localExistsTemplate', localExistsTemplate);
  const { outputPath } = projectConfig;
  await tryCall(async () => {
    await dirCheckIsEmpty(outputPath);
    // 创建模板存储目录 (同时会创建项目目录)
    await fsExtra.mkdir(path.resolve(outputPath, TEMPLATE_STORE_FOLDER_NAME), { recursive: true });
    const spinner = yoctoSpinner({ text: localExistsTemplate ? '读取模板...' : '下载模板...' }).start();
    setItem('spinner', spinner);
    // 下载模板
    await downloadTemplates();
    // 生成模板
    await buildTemplate();
    spinner.text = '项目生成成功';
    spinner.success();
    print(colorize`{green ${ICON_MAP.success} ${projectConfig.projectName} 生成成功}`);
  });
  // 删除模板存储目录
  await fsExtra.rm(path.resolve(outputPath, TEMPLATE_STORE_FOLDER_NAME), { recursive: true });
  return projectConfig;
}

export async function createPackage(config: Partial<ProjectConfig>, option?: CallOption) {
  setItem('callOption', option || {});

  const { outputPath, projectName } = buildConfig(config);
  print(colorize`{yellow.bold ${ICON_MAP.warning} npm 包模板不会应用 projectName, projectName 只用于目录生成}`);
  const spinner = yoctoSpinner({ text: '下载 npm 包模板中' }).start();
  await tryCall(async () => {
    await dirCheckIsEmpty(outputPath);
    await gitDown(NPM_PACKAGE_TEMPLATE_URL, { output: outputPath });
  });
  spinner.success();
  print(colorize`{green ${ICON_MAP.success} ${projectName} 生成成功}`);
}
