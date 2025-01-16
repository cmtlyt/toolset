import type { TemplateInfo } from '$/template-system/types';
import type { ProjectConfig } from '$/types';
import { loader } from '$/template-system/template-map';
import { Builder } from '$/types';

export const BUILDER_EXTEND_FILE_MAP: Record<Builder, (config: ProjectConfig) => TemplateInfo[]> = {
  [Builder.vite]: ({ enableTypeScript }) => {
    return [
      { filePath: 'src/vite-env.d.ts', loader, path: '/other/vite-env.d', ignore: !enableTypeScript },
    ];
  },
  [Builder.webpack]: () => [
  ],
  [Builder.rolldown]: () => [
  ],
  [Builder.rsbuild]: () => [
    { filePath: 'src/env.d.ts', loader, path: '/other/rsbuild-env.d' },
  ],
};
