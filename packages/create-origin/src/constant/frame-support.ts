import { Builder, Frame } from '$/types';

/** 构建器支持的框架 */
export const FRAME_SUPPORT: Record<Builder, Frame[]> = {
  [Builder.vite]: [Frame.vue],
  [Builder.webpack]: [],
  [Builder.rolldown]: [],
  [Builder.rsbuild]: [],
};
