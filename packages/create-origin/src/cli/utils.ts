import type { ProjectConfig } from '$/types';

export async function cliProcess(options: Partial<ProjectConfig>) {
  console.log(options);
}
