import type { TemplateInfo } from '$/template-system/types';
import type { TemplateState } from '$/types';
import { loader } from '$/template-system/template-map';
import { Frame } from '$/types';

function parse(content: Record<string, string>, config: TemplateState) {
  return content[config.builder] || content.default;
}

export const FRAME_EXTEND_FILES: Record<Frame, TemplateInfo[]> = {
  [Frame.vue]: [],
  [Frame.vueSwc]: [],
  [Frame.react]: [],
  [Frame.reactSwc]: [],
  [Frame.preact]: [],
  [Frame.solid]: [],
  [Frame.svelte]: [
    { parse, loader, path: '/other-config/svelte.config' },
  ],
};
