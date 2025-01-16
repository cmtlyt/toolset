import type { DepItem } from '$/types';
import { Builder, Frame } from '$/types';

/** 构建工具用于解析框架的插件映射 */
export const BUILD_FRAME_PLUGIN_MAP: Record<Builder, Record<Frame, DepItem>> = {
  [Builder.vite]: {
    [Frame.vue]: { name: '@vitejs/plugin-vue', version: '^5.2.1', isDev: true },
    [Frame.vueSwc]: { name: '', version: '', isDev: true },
    [Frame.react]: { name: '@vitejs/plugin-react', version: '^4.3.4', isDev: true },
    [Frame.reactSwc]: { name: '@vitejs/plugin-react-swc', version: '^3.7.2', isDev: true },
    [Frame.preact]: { name: '@preact/preset-vite', version: '^2.9.4', isDev: true },
    [Frame.solid]: { name: 'vite-plugin-solid', version: '^2.11.0', isDev: true },
    [Frame.svelte]: { name: '@sveltejs/vite-plugin-svelte', version: '^5.0.3', isDev: true },
  },
  [Builder.webpack]: {
    [Frame.vue]: { name: '', version: '', isDev: true },
    [Frame.vueSwc]: { name: '', version: '', isDev: true },
    [Frame.react]: { name: '', version: '', isDev: true },
    [Frame.reactSwc]: { name: '', version: '', isDev: true },
    [Frame.preact]: { name: '', version: '', isDev: true },
    [Frame.solid]: { name: '', version: '', isDev: true },
    [Frame.svelte]: { name: '', version: '', isDev: true },
  },
  [Builder.rolldown]: {
    [Frame.vue]: { name: '', version: '', isDev: true },
    [Frame.vueSwc]: { name: '', version: '', isDev: true },
    [Frame.react]: { name: '', version: '', isDev: true },
    [Frame.reactSwc]: { name: '', version: '', isDev: true },
    [Frame.preact]: { name: '', version: '', isDev: true },
    [Frame.solid]: { name: '', version: '', isDev: true },
    [Frame.svelte]: { name: '', version: '', isDev: true },
  },
  [Builder.rsbuild]: {
    [Frame.vue]: { name: '@rsbuild/plugin-vue', version: '^1.0.5', isDev: true },
    [Frame.vueSwc]: { name: '', version: '', isDev: true },
    [Frame.react]: { name: '@rsbuild/plugin-react', version: '^1.0.7', isDev: true },
    [Frame.reactSwc]: { name: '', version: '', isDev: true },
    [Frame.preact]: { name: '@rsbuild/plugin-preact', version: '^1.2.0', isDev: true },
    [Frame.solid]: { name: '@rsbuild/plugin-solid', version: '^1.0.4', isDev: true },
    [Frame.svelte]: { name: '@rsbuild/plugin-svelte', version: '^1.0.5', isDev: true },
  },
};
