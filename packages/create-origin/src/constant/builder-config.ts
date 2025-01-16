import type { TemplateInfo } from '$/template-system/types';
import { loader } from '$/template-system/template-map';
import { Builder } from '$/types';

export const BUILDER_CONFIG_PATH: Record<Builder, string> = {
  [Builder.vite]: 'vite.config.#{ext}',
  [Builder.webpack]: 'webpack.config.#{ext}',
  [Builder.rolldown]: 'rolldown.config.#{ext}',
  [Builder.rsbuild]: 'rsbuild.config.#{ext}',
};

export const BUILDER_CONFIG_MAP: Record<Builder, TemplateInfo[]> = {
  [Builder.vite]: [
    { filePath: BUILDER_CONFIG_PATH[Builder.vite], loader, path: '/builder-config/vite.config' },
  ],
  [Builder.webpack]: [
    { filePath: BUILDER_CONFIG_PATH[Builder.webpack], loader, path: '/builder-config/webpack.config' },
  ],
  [Builder.rolldown]: [
    { filePath: BUILDER_CONFIG_PATH[Builder.rolldown], loader, path: '/builder-config/rolldown.config' },
  ],
  [Builder.rsbuild]: [
    { filePath: BUILDER_CONFIG_PATH[Builder.rsbuild], loader, path: '/builder-config/rsbuild.config' },
  ],
};
