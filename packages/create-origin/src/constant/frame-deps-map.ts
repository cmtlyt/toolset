import type { DepItem } from '$/types';
import { Frame } from '$/types';

export const FRAME_DEPS_MAP: Record<Frame, DepItem[]> = {
  [Frame.vue]: [
    { name: 'vue', version: '^3.5.13' },
    { name: '@vitejs/plugin-vue', version: '^5.2.1', isDev: true },
  ],
  [Frame.vueSwc]: [],
  [Frame.react]: [
    { name: 'react', version: '^18.3.1' },
    { name: 'react-dom', version: '^18.3.1' },
    { name: '@vitejs/plugin-react', version: '^4.3.4', isDev: true },
  ],
  [Frame.reactSwc]: [
    { name: 'react', version: '^18.3.1' },
    { name: 'react-dom', version: '^18.3.1' },
    { name: '@vitejs/plugin-react-swc', version: '^3.7.2', isDev: true },
  ],
  [Frame.preact]: [
    { name: 'preact', version: '^10.25.4' },
    { name: '@preact/preset-vite', version: '^2.9.4', isDev: true },
  ],
  [Frame.svelte]: [],
  [Frame.solid]: [],
};
