import path from 'node:path';
import process from 'node:process';
import fse from 'fs-extra';
import { TEMPLATE_STORE_FOLDER_NAME } from './constant';
import { setItem } from './store';
import { buildTemplate, downloadTemplates } from './template-system';
import { Builder, Frame, type ProjectConfig } from './types';

function buildConfig(config: Partial<ProjectConfig>): ProjectConfig {
  const { projectName } = config;
  const outputPath = path.resolve(process.cwd(), projectName || '.');
  return {
    projectName: projectName === '.' || !projectName ? path.dirname(outputPath) : projectName,
    autoInstall: false,
    builderId: Builder.vite,
    enableEslint: true,
    enablePrettier: false,
    enableTypeScript: true,
    frameId: Frame.react,
    packageManager: 'npm',
    ...config,
    outputPath,
  };
}

export async function createProject(config: Partial<ProjectConfig>) {
  const projectConfig = buildConfig(config);
  setItem('projectConfig', projectConfig);
  const { outputPath } = projectConfig;
  // 创建模板存储目录 (同时会创建项目目录)
  await fse.mkdir(path.resolve(outputPath, TEMPLATE_STORE_FOLDER_NAME), { recursive: true });
  // 下载模板
  await downloadTemplates();
  // 生成模板
  await buildTemplate();
  // 删除模板存储目录
  await fse.rm(path.resolve(outputPath, TEMPLATE_STORE_FOLDER_NAME), { recursive: true });
}
