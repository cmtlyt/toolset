import { Builder, Frame } from '$/types';

/** 构建器支持的框架 */
export const FRAME_SUPPORT: Record<Builder, Frame[]> = {
  [Builder.vite]: [Frame.vue, Frame.react, Frame.reactSwc, Frame.preact, Frame.svelte, Frame.solid],
  [Builder.webpack]: [],
  [Builder.rolldown]: [],
  [Builder.rsbuild]: [Frame.react, Frame.vue, Frame.solid, Frame.preact, Frame.svelte],
};
