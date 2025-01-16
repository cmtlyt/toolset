import { spawnSync } from 'node:child_process';

export async function initGitRepo(dir: string) {
  spawnSync('git', ['init', '.'], { cwd: dir });
  spawnSync('git', ['add', '.'], { cwd: dir });
  spawnSync('git', ['commit', '-m', 'feat: init'], { cwd: dir });
}
