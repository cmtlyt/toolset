import { Builder, Frame, Registry } from '$/types';

/** 模板的下载目录 */
export const TEMPLATE_ORIGIN_PATH_MAP: Record<Registry, string> = {
  [Registry.gitee]: './template',
  [Registry.github]: './template',
};

/** 临时存储模板的目录名 */
export const TEMPLATE_STORE_FOLDER_NAME = `.template-${Date.now()}`;

export { BUILD_FRAME_PLUGIN_IMPORT_EXPRESSION } from './import-expression';

export { BUILD_FRAME_PLUGIN_MAP } from './plugin-map';

/** 支持的构建工具 */
export const SUPPORT_BUILDERS = Object.values(Builder);

/** 支持的框架 */
export const SUPPORT_FRAMES = Object.values(Frame);
