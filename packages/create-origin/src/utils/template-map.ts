import type { TemplateInfo, TemplateInfoBase, TemplateInfoWithParse, TemplateInfoWithSource } from '$/template-system/types';
import type { DownloadTempalteFunc } from '$/template-system/utils';
import { getItem } from '$/store';
import { getTemplateUrl } from '$/template-system/utils';
import { Builder, Frame } from '$/types';

/** 资源加载方法 */
const loader: TemplateInfo['loader'] = async function (this: TemplateInfoBase, download: DownloadTempalteFunc) {
  const localPath = await download(getTemplateUrl(this.path));
  this.localPath = localPath;
  return localPath;
};

/** 静态配置文件 */
export const baseFiles = [
  { filePath: 'package.json', loader, path: '/other-config/package' },
  { filePath: 'README.md', loader, path: '/other/readme' },
];

/** 获取打包工具配置模板 */
export function getBuilderTemplate(builderId: Builder): TemplateInfoWithSource {
  const { enableTypeScript: enableTs = true } = getItem('projectConfig');
  switch (builderId) {
    case Builder.vite:
      return { filePath: `vite.config.${enableTs ? 'ts' : 'js'}`, loader, path: '/builder-config/vite.config' };
    case Builder.webpack:
      return { filePath: `webpack.config.${enableTs ? 'ts' : 'js'}`, loader, path: '/builder-config/webpack.config' };
    case Builder.rolldown:
      return { filePath: `rolldown.config.${enableTs ? 'ts' : 'js'}`, loader, path: '/builder-config/rolldown.config' };
    case Builder.rsbuild:
      return { filePath: `sbuild.config.${enableTs ? 'ts' : 'js'}`, loader, path: '/builder-config/rsbuild.config' };
    default:
      builderId satisfies never;
      throw new TypeError('未知打包工具');
  }
}

/** 获取框架模板 */
export function getFrameTemplate(frameId: Frame): TemplateInfoWithParse {
  const parse: TemplateInfoWithParse['parse'] = (content, config) => {
    const { enableTypeScript } = config;
    return content[enableTypeScript ? 'typescript' : 'javascript'] || content.default;
  };
  switch (frameId) {
    case Frame.vue:
    case Frame.vueSfc:
      return { parse, loader, path: '/project-source/vue' };
    case Frame.react:
    case Frame.reactSfc:
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
