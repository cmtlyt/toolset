import type { TemplateInfo, TemplateInfoBase, TemplateInfoWithParse, TemplateInfoWithSource } from '$/template-system/types';
import type { DownloadTempalteFunc } from '$/template-system/utils';
import type { ProjectConfig } from '$/types';
import { BUILDER_CONFIG_MAP } from '$/constant/builder-config';
import { BUILDER_EXTEND_FILE_MAP } from '$/constant/builder-extends-files';
import { FRAME_EXTEND_FILES } from '$/constant/frame-extend-files';
import { getItem } from '$/store';
import { getTemplateUrl } from '$/template-system/utils';
import { Builder, Frame } from '$/types';

/** 资源加载方法 */
export async function loader(this: TemplateInfoBase, download: DownloadTempalteFunc) {
  const localPath = await download(getTemplateUrl(this.path));
  this.localPath = localPath;
  return localPath;
};

/** 获取打包工具配置模板 */
export function getBuilderTemplate(config: ProjectConfig): TemplateInfoWithSource[] {
  const { builderId } = config;
  const templates = BUILDER_CONFIG_MAP[builderId];
  if (!templates) {
    throw new TypeError(`没有 ${builderId} 打包工具配置模板`);
  }
  return templates;
}

export function getBuilderExtendTemplate(config: ProjectConfig): TemplateInfoWithSource[] {
  const { builderId } = config;
  const getFunc = BUILDER_EXTEND_FILE_MAP[builderId];
  if (!getFunc)
    return [];
  return getFunc(config);
}

export function getFrameExtendTemplate(config: ProjectConfig): TemplateInfo[] {
  const { frameId } = config;
  return FRAME_EXTEND_FILES[frameId] || [];
}

/** 获取框架模板 */
export function getFrameTemplate(frameId: Frame): TemplateInfoWithParse {
  const parse: TemplateInfoWithParse['parse'] = (content, config) => {
    const { enableTypeScript } = config;
    return content[enableTypeScript ? 'typescript' : 'javascript'] || content.default;
  };
  switch (frameId) {
    case Frame.vue:
    case Frame.vueSwc:
      return { parse, loader, path: '/project-source/vue' };
    case Frame.react:
    case Frame.reactSwc:
      return { parse, loader, path: '/project-source/react' };
    case Frame.preact:
      return { parse, loader, path: '/project-source/preact' };
    case Frame.solid:
      return { parse, loader, path: '/project-source/solid' };
    case Frame.svelte:
      return { parse, loader, path: '/project-source/svelte' };
    default:
      frameId satisfies never;
      throw new TypeError('未知框架');
  }
}

/** 获取扩展配置模板 */
export function getExtendTemplate(): TemplateInfoWithSource[] {
  const config = getItem('projectConfig');
  const sourceList: TemplateInfoWithSource[] = [];
  const enableTs = config.enableTypeScript;

  // eslint 配置文件
  if (config.enableEslint) {
    sourceList.push({ filePath: `eslint.config.${enableTs ? 'ts' : 'js'}`, loader, path: `/other-config/eslint.config` });
    // 使用 eslint 格式化
    if (!config.enablePrettier) {
      sourceList.push({ filePath: '.vscode/settings.json', loader, path: '/other-config/eslint-vscode.settings' });
    }
  }

  // prettier 配置文件
  if (config.enablePrettier) {
    sourceList.push({ filePath: '.prettierrc', loader, path: '/other-config/prettier' });
  }
  // ts 配置文件
  if (config.enableTypeScript) {
    sourceList.push(...[
      { filePath: 'tsconfig.json', loader, path: '/other-config/tsconfig' },
      { filePath: 'tsconfig.app.json', loader, path: '/other-config/tsconfig.app' },
      { filePath: 'tsconfig.node.json', loader, path: '/other-config/tsconfig.node' },
    ]);
  }
  return sourceList;
}
