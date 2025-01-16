import { Builder, Frame } from '$/types';

type ImportFunc = (frameId: Frame, framePlugin: string) => string;

/** 默认导入 */
const defaultImport: ImportFunc = (frameId, framePlugin) => `import ${frameId} from '${framePlugin}';`;

/** 具名导入 */
const namedImport: (name: string) => ImportFunc
  = (name: string) => (frameId, framePlugin) => `import { ${name} as ${frameId} } from '${framePlugin}';`;

/** 空函数 */
const noop: ImportFunc = () => '';

export const OVERREAD_FRAME_USE_PLUGIN_CODE: Record<Builder, Record<Frame, string>> = {
  [Builder.vite]: {
    [Frame.vue]: '',
    [Frame.vueSwc]: '',
    [Frame.react]: '',
    [Frame.reactSwc]: '',
    [Frame.preact]: '',
    [Frame.solid]: '',
    [Frame.svelte]: '',
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
    [Frame.solid]: 'pluginBabel({ include: /\\.(?:jsx|tsx)$/ }), solid()',
    [Frame.svelte]: '',
  },
};

export const BUILD_FRAME_PLUGIN_IMPORT_EXPRESSION: Record<Builder, Record<Frame, ImportFunc>> = {
  [Builder.vite]: {
    [Frame.vue]: defaultImport,
    [Frame.vueSwc]: defaultImport,
    [Frame.react]: defaultImport,
    [Frame.reactSwc]: defaultImport,
    [Frame.preact]: defaultImport,
    [Frame.solid]: defaultImport,
    [Frame.svelte]: namedImport('svelte'),
  },
  [Builder.webpack]: {
    [Frame.vue]: noop,
    [Frame.vueSwc]: noop,
    [Frame.react]: noop,
    [Frame.reactSwc]: noop,
    [Frame.preact]: noop,
    [Frame.solid]: noop,
    [Frame.svelte]: noop,
  },
  [Builder.rolldown]: {
    [Frame.vue]: noop,
    [Frame.vueSwc]: noop,
    [Frame.react]: noop,
    [Frame.reactSwc]: noop,
    [Frame.preact]: noop,
    [Frame.solid]: noop,
    [Frame.svelte]: noop,
  },
  [Builder.rsbuild]: {
    [Frame.vue]: namedImport('pluginVue'),
    [Frame.vueSwc]: noop,
    [Frame.react]: namedImport('pluginReact'),
    [Frame.reactSwc]: noop,
    [Frame.preact]: namedImport('pluginPreact'),
    [Frame.solid]: (frameId, framePlugin) => {
      return `import { pluginBabel } from '@rsbuild/plugin-babel';\nimport { pluginSolid as ${frameId} } from '${framePlugin}';`;
    },
    [Frame.svelte]: namedImport('pluginSvelte'),
  },
};
