import type { DepItem, ProjectConfig, Scripts, TemplateState } from '$/types';
import type { FinishedTemplateInfo, TemplateInfo } from './types';
import fs from 'node:fs/promises';
import { resolve as pathResolve } from 'node:path';
import { BASE_DEPS, BASE_SCRIPTS, TEMPLATE_ORIGIN_PATH_MAP, TEMPLATE_STORE_FOLDER_NAME } from '$/constant';
import { getItem } from '$/store';
import { Builder, Frame } from '$/types';
import { getBuilderDeps, getEslintDeps, getFrameDeps, getPrettierDeps, getTypescriptDeps } from './dependencie-map';

type SourceUrl = string;

const getTemplateOriginPath = (() => {
  let templateOriginPath = '';

  return () => {
    if (templateOriginPath)
      return templateOriginPath;
    const { registry } = getItem('projectConfig');
    templateOriginPath = TEMPLATE_ORIGIN_PATH_MAP[registry];
    if (!templateOriginPath) {
      throw new Error('不支持的模板仓库');
    }
    return templateOriginPath;
  };
})();

/** 获取模板地址 */
export function getTemplateUrl(path: string) {
  return `${getTemplateOriginPath()}${path}.json`;
}

export function buildFilePath(template: FinishedTemplateInfo, config: ProjectConfig | TemplateState) {
  const { enableTypeScript } = config;
  const extname = enableTypeScript ? 'ts' : 'js';
  return template.filePath.replace(/#\{ext\}/g, extname);
}

export function buildTemplateInfos(templates: FinishedTemplateInfo[], config: ProjectConfig | TemplateState) {
  return templates.map((item) => {
    if (item.filePath) {
      item.filePath = buildFilePath(item, config);
    }
    return item;
  });
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
    filePath: (templateInfo as TemplateInfo).filePath || '',
  };
}

/** 解析模板 */
export function parseTemplate(item: TemplateInfo, content: any, config: TemplateState) {
  return item.parse!(content, config);
}

/** 获取模板 */
export function getTemplate(content: any, config: TemplateState) {
  return content[config.frame] || content.default;
}

/** 获取开发生产依赖 */
export function getDepMap(config: ProjectConfig) {
  const list: DepItem[] = [...BASE_DEPS];
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
    prev[key].push(curr);
    return prev;
  }, { dependencies: [], devDependencies: [] } as Record<'devDependencies' | 'dependencies', DepItem[]>);
}

/** 获取 npm 脚本 */
export function getScripts(config: ProjectConfig): Scripts {
  const { builderId, frameId, enableTypeScript } = config;

  const scirptMap = {
    [Builder.vite]: {
      dev: 'vite',
      build: `${enableTypeScript && frameId !== Frame.svelte ? 'vue-tsc -b && ' : ''}vite build`,
      preview: 'vite preview',
      ...(frameId === Frame.svelte && enableTypeScript
        ? {
            check: 'svelte-check --tsconfig ./tsconfig.app.json && tsc -p tsconfig.node.json',
          }
        : {}),
    },
    [Builder.webpack]: {
      dev: '',
      build: '',
    },
    [Builder.rolldown]: {
      dev: '',
      build: '',
    },
    [Builder.rsbuild]: {
      dev: 'rsbuild dev --open',
      build: 'rsbuild build',
      preview: 'rsbuild preview',
      ...(frameId === Frame.svelte && enableTypeScript
        ? {
            'svelte-check': 'svelte-check --tsconfig ./tsconfig.json',
          }
        : {}),
    },
  };

  return { ...scirptMap[builderId], ...BASE_SCRIPTS };
}
