import { Builder, Frame, Registry } from '$/types';

/** 构建器支持的框架 */
const FRAME_SUPPORT: Record<Builder, Frame[]> = {
  [Builder.vite]: [Frame.vue, Frame.react, Frame.reactSwc, Frame.preact, Frame.svelte, Frame.solid],
  [Builder.webpack]: [],
  [Builder.rolldown]: [],
  [Builder.rsbuild]: [Frame.react, Frame.vue, Frame.solid, Frame.preact, Frame.svelte],
};

/** 模板的下载目录 */
const TEMPLATE_ORIGIN_PATH_MAP: Record<Registry, string> = {
  [Registry.gitee]: '',
  [Registry.github]: 'https://github.com/cmtlyt/toolset/blob/main/packages/create-origin/template',
};

export default {
  FRAME_SUPPORT,
  TEMPLATE_ORIGIN_PATH_MAP,
};
