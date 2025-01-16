import type { DepItem } from '$/types';

export const BASE_DEPS: DepItem[] = [
  { name: '@commitlint/cli', version: '^19.6.1', isDev: true },
  { name: '@commitlint/config-conventional', version: '^19.6.0', isDev: true },
  { name: 'bumpp', version: '^9.10.1', isDev: true },
  { name: 'husky', version: '^9.1.7', isDev: true },
  { name: 'lint-staged', version: '^15.2.11', isDev: true },
];
