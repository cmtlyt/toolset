import type { DepItem, ProjectConfig } from '$/types';
import { Frame } from '$/types';

export const FRAME_DEPS_MAP: Record<Frame, (config: ProjectConfig) => DepItem[]> = {
  [Frame.vue]: () => [
    { name: 'vue', version: '^3.5.13' },
    { name: '@vitejs/plugin-vue', version: '^5.2.1', isDev: true },
  ],
  [Frame.vueSwc]: () => [],
  [Frame.react]: () => [
    { name: 'react', version: '^18.3.1' },
    { name: 'react-dom', version: '^18.3.1' },
    { name: '@vitejs/plugin-react', version: '^4.3.4', isDev: true },
  ],
  [Frame.reactSwc]: () => [
    { name: 'react', version: '^18.3.1' },
    { name: 'react-dom', version: '^18.3.1' },
    { name: '@vitejs/plugin-react-swc', version: '^3.7.2', isDev: true },
  ],
  [Frame.preact]: () => [
    { name: 'preact', version: '^10.25.4' },
    { name: '@preact/preset-vite', version: '^2.9.4', isDev: true },
  ],
  [Frame.svelte]: ({ enableTypeScript }) => [
    { name: '@sveltejs/vite-plugin-svelte', version: '^5.0.3', isDev: true },
    { name: 'svelte', version: '^5.16.5', isDev: true },
    ...(enableTypeScript
      ? [
          { name: '@tsconfig/svelte', version: '^5.0.4', isDev: true },
          { name: 'svelte-check', version: '^4.1.1', isDev: true },
        ]
      : []),
  ],
  [Frame.solid]: () => [
    { name: 'solid-js', version: '^1.9.3' },
    { name: 'vite-plugin-solid', version: '^2.11.0', isDev: true },
  ],
};
