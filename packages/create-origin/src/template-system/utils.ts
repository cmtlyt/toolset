import type { DepItem, ProjectConfig, Scripts, TemplateState } from '$/types';
import type { FinishedTemplateInfo, TemplateInfo, TemplateInfoWithParse, TemplateInfoWithSource } from './types';
import fs from 'node:fs/promises';
import { resolve as pathResolve } from 'node:path';
import { TEMPLATE_ORIGIN_PATH, TEMPLATE_STORE_FOLDER_NAME } from '$/constant';
import { getItem } from '$/store';
import { Builder } from '$/types';
import { getBuilderDeps, getEslintDeps, getFrameDeps, getPrettierDeps, getTypescriptDeps } from '$/utils/dependencie-map';

type SourceUrl = string;

/** 获取模板地址 */
export function getTemplateUrl(path: string) {
  return `${TEMPLATE_ORIGIN_PATH}${path}.json`;
}

/** 获取下载模板函数 */
export function getDownloadTemplateFunc(): DownloadTempalteFunc {
  const config = getItem('projectConfig');
  const { outputPath } = config;
  const templateStorePath = pathResolve(outputPath, TEMPLATE_STORE_FOLDER_NAME);
  return async (url) => {
    const localPath = pathResolve(templateStorePath, url.split('/').pop()!);
    // TODO: 替换为 git-down
    await fs.copyFile(url, localPath);
    return localPath;
  };
}

export type DownloadTempalteFunc = (url: SourceUrl) => Promise<string>;

/** 构造模板信息 */
export function buildTemplateInfo(templateInfo: TemplateInfo): FinishedTemplateInfo {
  return {
    content: templateInfo.content || '',
    localPath: templateInfo.localPath!,
    path: templateInfo.path,
    filePath: (templateInfo as TemplateInfoWithSource).filePath || '',
  };
}

/** 解析模板 */
export function parseTemplate(item: TemplateInfoWithParse, content: any, config: TemplateState) {
  return item.parse(content, config);
}

/** 获取模板 */
export function getTemplate(content: any, config: TemplateState) {
  return content[config.frame] || content.default;
}

/** 获取开发生产依赖 */
export function getDepMap(config: ProjectConfig) {
  const list: DepItem[] = [];
  const { enableEslint, enablePrettier, enableTypeScript } = config;
  list.push(...getBuilderDeps(config));
  list.push(...getFrameDeps(config));
  enableEslint && list.push(...getEslintDeps(config));
  enablePrettier && list.push(...getPrettierDeps());
  enableTypeScript && list.push(...getTypescriptDeps());
  return list.reduce((prev, curr) => {
    if (curr.ignore)
      return prev;
    const key = curr.isDev ? 'devDependencies' : 'dependencies';
    prev[key] ||= [];
    prev[key].push(curr);
    return prev;
  }, {} as Record<'devDependencies' | 'dependencies', DepItem[]>);
}

/** 获取 npm 脚本 */
export function getScripts(config: ProjectConfig): Scripts {
  const { builderId, enableTypeScript } = config;

  const scirptMap = {
    [Builder.vite]: {
      builderDev: 'vite',
      builderBuild: `${enableTypeScript ? 'vue-tsc -b && ' : ''}vite build`,
      builderPreview: 'vite preview',
    },
    [Builder.webpack]: {
      builderDev: '',
      builderBuild: '',
    },
    [Builder.rolldown]: {
      builderDev: '',
      builderBuild: '',
    },
    [Builder.rsbuild]: {
      builderDev: '',
      builderBuild: '',
    },
  };

  return scirptMap[builderId];
}
