import type { ProjectConfig } from './types';
import fs from 'node:fs/promises';
import { Frame } from './types';

const sourceOriginPath = '.';

type FilePath = string;
type SourceUrl = string;

function getTemplateUrl(path: string) {
  return `${sourceOriginPath}${path}.json`;
}

async function downloadTemplate(url: SourceUrl) {
  // TODO: 替换为 git-down
  return fs.copyFile(url, `./temp/${url.split('/').pop()}`);
}

type DownloadTempalteFunc = typeof downloadTemplate;

type SourceTemplateList = (Record<FilePath, SourceUrl>
  | { loader: (get: DownloadTempalteFunc) => ReturnType<DownloadTempalteFunc> })[];

function getFrameTemplate(frameId: Frame): SourceTemplateList[number] {
  switch (frameId) {
    case Frame.vue:
    case Frame.vueSfc:
      return { loader: get => get(getTemplateUrl('/project-source/vue')) };
    case Frame.react:
    case Frame.reactSfc:
      return { loader: get => get(getTemplateUrl('/project-source/react')) };
    case Frame.preact:
      return { loader: get => get(getTemplateUrl('/project-source/preact')) };
    case Frame.solid:
      return { loader: get => get(getTemplateUrl('/project-source/solid')) };
    case Frame.svelte:
      return { loader: get => get(getTemplateUrl('/project-source/svelte')) };
    case Frame.package:
      return {};
    default:
      frameId satisfies never;
      throw new TypeError('未知框架');
  }
}

export function getSourceTemplateList(config: ProjectConfig) {
  if (!config.frameId) {
    throw new TypeError('必须选择一个框架');
  }
  const sourceList: SourceTemplateList = [];
  // 框架源码配置
  sourceList.push(getFrameTemplate(config.frameId));

  // 基本配置
  sourceList.push({ 'package.json': getTemplateUrl('/other-config/package') });
  sourceList.push({ 'readme.json': getTemplateUrl('/other-config/readme') });

  const isTs = config.enableTypeScript;
  if (config.enableEslint) {
    sourceList.push({ [`eslint.config.${isTs ? 'ts' : 'js'}`]: getTemplateUrl(`/other-config/eslint.config`) });
  }
  if (config.enableTypeScript) {
    sourceList.push(...[
      { 'tsconfig.json': getTemplateUrl('/other-config/tsconfig') },
      { 'tsconfig.app.json': getTemplateUrl('/other-config/tsconfig.app') },
      { 'tsconfig.node.json': getTemplateUrl('/other-config/tsconfig.node') },
    ]);
  }
  return sourceList;
}

export function downloadTemplateList(templateList: SourceTemplateList) {
  return Promise.all(templateList.map((item) => {
    if (typeof item === 'object' && typeof item.loader === 'function') {
      return item.loader(downloadTemplate);
    }
    return Object.entries(item).map(([_, url]) => downloadTemplate(url)) as Promise<void>[];
  }));
}
