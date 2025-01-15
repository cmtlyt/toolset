import type { TemplateInfo } from '$/template-system/types';
import type { DepItem, Scripts } from '$/types';
import { loader } from '$/template-system/template-map';
import { Builder, Frame, Registry } from '$/types';

/** 模板的下载目录 */
export const TEMPLATE_ORIGIN_PATH_MAP: Record<Registry, string> = {
  [Registry.gitee]: './template',
  [Registry.github]: './template',
};

/** 临时存储模板的目录名 */
export const TEMPLATE_STORE_FOLDER_NAME = `.template-${Date.now()}`;

export { FRAME_SUPPORT } from './frame-support';

export { ICON_MAP } from './icon';

/** 支持的构建工具 */
export const SUPPORT_BUILDERS = Object.values(Builder);

/** 支持的框架 */
export const SUPPORT_FRAMES = Object.values(Frame);

export { BUILD_FRAME_PLUGIN_IMPORT_EXPRESSION } from './import-expression';

export { BUILD_FRAME_PLUGIN_MAP } from './plugin-map';

export const NPM_PACKAGE_TEMPLATE_URL = 'https://github.com/cmtlyt/template-pack';

export const BASE_SCRIPTS: Omit<Scripts, 'dev' | 'build'> = {
  prepare: 'husky',
};

export const BASE_DEPS: DepItem[] = [
  { name: '@commitlint/cli', version: '^19.6.1', isDev: true },
  { name: '@commitlint/config-conventional', version: '^19.6.0', isDev: true },
  { name: 'bumpp', version: '^9.10.1', isDev: true },
  { name: 'husky', version: '^9.1.7', isDev: true },
  { name: 'lint-staged', version: '^15.2.11', isDev: true },
];

/** 基本文件文件 */
export const BASE_FILES: TemplateInfo[] = [
  { filePath: 'package.json', loader, path: '/other-config/package' },
  { filePath: 'README.md', loader, path: '/other/readme' },
  { filePath: '.gitignore', loader, path: '/other-config/gitignore' },
  { filePath: 'commitlint.config.ts', loader, path: '/other-config/commitlint.config' },
  { parse: content => content.default, loader, path: '/other-config/husky' },
];
