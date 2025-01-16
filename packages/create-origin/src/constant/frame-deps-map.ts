import type { DepItem, ProjectConfig } from '$/types';
import { Builder, Frame } from '$/types';
import { BUILD_FRAME_PLUGIN_MAP } from './plugin-map';

function getBuilderPlugin(builderId: Builder, frameId: Frame): [DepItem] {
  const plugin = BUILD_FRAME_PLUGIN_MAP[builderId][frameId];
  if (!plugin) {
    throw new TypeError(`${builderId} 没有预设 ${frameId} 的插件`);
  }
  return [plugin];
}

export const FRAME_DEPS_MAP: Record<Frame, (config: ProjectConfig) => DepItem[]> = {
  [Frame.vue]: ({ builderId }) => [
    { name: 'vue', version: '^3.5.13' },
    ...getBuilderPlugin(builderId, Frame.vue),
  ],
  [Frame.vueSwc]: () => [],
  [Frame.react]: ({ builderId, enableTypeScript }) => [
    { name: 'react', version: '^18.3.1' },
    { name: 'react-dom', version: '^18.3.1' },
    { name: '@types/react', version: '^18.3.1', isDev: true, ignore: !enableTypeScript },
    { name: '@types/react-dom', version: '^18.3.1', isDev: true, ignore: !enableTypeScript },
    ...getBuilderPlugin(builderId, Frame.react),
  ],
  [Frame.reactSwc]: ({ builderId, enableTypeScript }) => [
    { name: 'react', version: '^18.3.1' },
    { name: 'react-dom', version: '^18.3.1' },
    { name: '@types/react', version: '^18.3.1', isDev: true, ignore: !enableTypeScript },
    { name: '@types/react-dom', version: '^18.3.1', isDev: true, ignore: !enableTypeScript },
    ...getBuilderPlugin(builderId, Frame.reactSwc),
  ],
  [Frame.preact]: ({ builderId }) => [
    { name: 'preact', version: '^10.25.4' },
    ...getBuilderPlugin(builderId, Frame.preact),
  ],
  [Frame.svelte]: ({ builderId, enableTypeScript }) => [
    { name: 'svelte', version: '^5.16.5' },
    { name: '@tsconfig/svelte', version: '^5.0.4', isDev: true, ignore: !enableTypeScript },
    { name: 'svelte-check', version: '^4.1.1', isDev: true, ignore: !enableTypeScript },
    ...getBuilderPlugin(builderId, Frame.svelte),
  ],
  [Frame.solid]: ({ builderId }) => [
    { name: 'solid-js', version: '^1.9.3' },
    { name: '@rsbuild/plugin-babel', version: '^1.0.3', isDev: true, ignore: builderId !== Builder.rsbuild },
    ...getBuilderPlugin(builderId, Frame.solid),
  ],
};
