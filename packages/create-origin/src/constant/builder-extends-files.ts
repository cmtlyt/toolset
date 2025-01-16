import type { TemplateInfoWithSource } from '$/template-system/types';
import type { ProjectConfig } from '$/types';
import { loader } from '$/template-system/template-map';
import { Builder } from '$/types';

export const BUILDER_EXTEND_FILE_MAP: Record<Builder, (config: ProjectConfig) => TemplateInfoWithSource[]> = {
  [Builder.vite]: (config: ProjectConfig) => {
    if (!config.enableTypeScript)
      return [];
    return [
      { filePath: 'vite-env.d.ts', loader, path: '/other-config/vite-env.d' },
    ];
  },
  [Builder.webpack]: () => [
  ],
  [Builder.rolldown]: () => [
  ],
  [Builder.rsbuild]: () => [
  ],
};
