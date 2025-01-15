import { Builder, Frame } from '$/types';

export const FRAME_SUPPORT: Record<Builder, Frame[]> = {
  [Builder.vite]: [Frame.vue, Frame.vueSfc, Frame.react, Frame.reactSfc, Frame.preact, Frame.solid, Frame.svelte],
  [Builder.webpack]: [],
  [Builder.rolldown]: [],
  [Builder.rsbuild]: [],
};
