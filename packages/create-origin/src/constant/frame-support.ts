import { Builder, Frame } from '$/types';

/** 构建器支持的框架 */
export const FRAME_SUPPORT: Record<Builder, Frame[]> = {
  [Builder.vite]: [Frame.vue, Frame.vueSfc, Frame.react, Frame.reactSfc, Frame.preact, Frame.solid, Frame.svelte],
  [Builder.webpack]: [],
  [Builder.rolldown]: [],
  [Builder.rsbuild]: [],
};
