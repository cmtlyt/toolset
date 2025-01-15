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
