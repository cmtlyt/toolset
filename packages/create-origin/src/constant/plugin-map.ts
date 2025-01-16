import { Builder, Frame } from '$/types';

/** 构建工具用于解析框架的插件映射 */
export const BUILD_FRAME_PLUGIN_MAP: Record<Builder, Record<Frame, string>> = {
  [Builder.vite]: {
    [Frame.vue]: '@vitejs/plugin-vue',
    [Frame.vueSwc]: '@vitejs/plugin-react-swc',
    [Frame.react]: '@vitejs/plugin-react',
    [Frame.reactSwc]: '@vitejs/plugin-react-swc',
    [Frame.preact]: '@preact/preset-vite',
    [Frame.solid]: 'vite-plugin-solid',
    [Frame.svelte]: '@sveltejs/vite-plugin-svelte',
  },
  [Builder.webpack]: {
    [Frame.vue]: '',
    [Frame.vueSwc]: '',
    [Frame.react]: '',
    [Frame.reactSwc]: '',
    [Frame.preact]: '',
    [Frame.solid]: '',
    [Frame.svelte]: '',
  },
  [Builder.rolldown]: {
    [Frame.vue]: '',
    [Frame.vueSwc]: '',
    [Frame.react]: '',
    [Frame.reactSwc]: '',
    [Frame.preact]: '',
    [Frame.solid]: '',
    [Frame.svelte]: '',
  },
  [Builder.rsbuild]: {
    [Frame.vue]: '',
    [Frame.vueSwc]: '',
    [Frame.react]: '',
    [Frame.reactSwc]: '',
    [Frame.preact]: '',
    [Frame.solid]: '',
    [Frame.svelte]: '',
  },
};
