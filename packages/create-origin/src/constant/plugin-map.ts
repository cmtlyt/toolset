import { Builder, Frame } from '$/types';

/** 构建工具用于解析框架的插件映射 */
export const BUILD_FRAME_PLUGIN_MAP: Record<Builder, Record<Frame, string>> = {
  [Builder.vite]: {
    [Frame.vue]: '@vitejs/plugin-vue',
    [Frame.vueSfc]: '@vitejs/plugin-vue-sfc',
    [Frame.react]: '@vitejs/plugin-react',
    [Frame.reactSfc]: '@vitejs/plugin-react-sfc',
    [Frame.preact]: '@preact/preset-vite',
    [Frame.solid]: 'vite-plugin-solid',
    [Frame.svelte]: '@sveltejs/vite-plugin-svelte',
    [Frame.package]: '',
  },
  [Builder.webpack]: {
    [Frame.vue]: '',
    [Frame.vueSfc]: '',
    [Frame.react]: '',
    [Frame.reactSfc]: '',
    [Frame.preact]: '',
    [Frame.solid]: '',
    [Frame.svelte]: '',
    [Frame.package]: '',
  },
  [Builder.rolldown]: {
    [Frame.vue]: '',
    [Frame.vueSfc]: '',
    [Frame.react]: '',
    [Frame.reactSfc]: '',
    [Frame.preact]: '',
    [Frame.solid]: '',
    [Frame.svelte]: '',
    [Frame.package]: '',
  },
  [Builder.rsbuild]: {
    [Frame.vue]: '',
    [Frame.vueSfc]: '',
    [Frame.react]: '',
    [Frame.reactSfc]: '',
    [Frame.preact]: '',
    [Frame.solid]: '',
    [Frame.svelte]: '',
    [Frame.package]: '',
  },
};
