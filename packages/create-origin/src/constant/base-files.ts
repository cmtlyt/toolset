import type { TemplateInfo } from '$/template-system/types';
import { loader } from '$/template-system/template-map';

/** 基本文件文件 */
export const BASE_FILES: TemplateInfo[] = [
  { filePath: 'package.json', loader, path: '/other-config/package' },
  { filePath: 'README.md', loader, path: '/other/readme' },
  { filePath: '.gitignore', loader, path: '/other/gitignore' },
  { filePath: 'commitlint.config.ts', loader, path: '/other-config/commitlint.config' },
  { parse: content => content.default, loader, path: '/other/husky' },
  { filePath: 'public/builder.svg', parse: (content, config) => content[config.builder] || content.default, loader, path: '/static-file/builder-icon' },
];
