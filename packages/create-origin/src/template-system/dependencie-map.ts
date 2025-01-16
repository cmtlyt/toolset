import type { DepItem, Frame, ProjectConfig } from '$/types';
import { BUILD_FRAME_PLUGIN_IMPORT_EXPRESSION, BUILD_FRAME_PLUGIN_MAP, FRAME_DEP_MAP } from '$/constant';
import { Builder } from '$/types';

/** 获取框架插件 */
export function getFramePlugin(builderId: Builder, frameId: Frame) {
  const plugin = BUILD_FRAME_PLUGIN_MAP[builderId]?.[frameId];
  if (!plugin) {
    throw new TypeError(`${builderId} 没有预设 ${frameId} 相关的 plugin`);
  }
  return plugin;
}

/** 获取框架插件导入代码 */
export function getFramePluginImport(builderId: Builder, frameId: Frame, framePlugin: string) {
  const importFunc = BUILD_FRAME_PLUGIN_IMPORT_EXPRESSION[builderId]?.[frameId];
  if (!importFunc) {
    throw new TypeError(`${builderId} 没有预设 ${framePlugin} 的导入方式`);
  }
  return importFunc(frameId, framePlugin);
}

export function getFramePluginUseFunc(_builderId: Builder, frameId: Frame, _framePlugin: string, pluginUseCode: string): boolean {
  return frameId === pluginUseCode;
}

/** 获取构建器依赖 */
export function getBuilderDeps(config: ProjectConfig) {
  const { builderId = Builder.vite, enableTypeScript = true } = config;
  const builderDepMap: Record<Builder, DepItem[]> = {
    [Builder.vite]: [
      { name: 'vite', version: '^6.0.7', isDev: true },
      { name: 'vue-tsc', version: '^2.2.0', isDev: true, ignore: !enableTypeScript },
      { name: '@vue/tsconfig', version: '^0.7.0', isDev: true, ignore: !enableTypeScript },
    ],
    [Builder.webpack]: [],
    [Builder.rolldown]: [],
    [Builder.rsbuild]: [
      { name: '@rsbuild/core', version: '^1.1.8', isDev: true },
    ],
  };
  return builderDepMap[builderId];
}

/** 获取框架依赖 */
export function getFrameDeps(config: ProjectConfig) {
  const { frameId } = config;
  const getFunc = FRAME_DEP_MAP[frameId];
  if (!getFunc)
    return [];
  return getFunc(config);
}

/** 获取 eslint 依赖 */
export function getEslintDeps(config: ProjectConfig): DepItem[] {
  const { enablePrettier = false } = config;
  return [
    { name: '@antfu/eslint-config', version: '^3.12.0', isDev: true },
    { name: 'eslint', version: '^9.17.0', isDev: true },
    { name: 'eslint-plugin-format', version: '^1.0.1', isDev: true, ignore: enablePrettier },
  ];
}

/** 获取 prettier 依赖 */
export function getPrettierDeps(): DepItem[] {
  return [
    { name: 'prettier', version: '^3.4.2', isDev: true },
  ];
}

/** 获取 typescript 依赖 */
export function getTypescriptDeps(): DepItem[] {
  return [
    { name: 'typescript', version: '^5.7.2', isDev: true },
  ];
}
