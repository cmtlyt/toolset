import type { State } from '$/types';
import { resolve } from 'node:path';
import { exec, rmdir } from '$/utils';

export function downloadMain(state: State) {
  const { gitInfo, option, callback } = state;
  const { branch, output } = option;
  const { owner, project } = gitInfo;

  const execOption = { cwd: resolve(output) };

  // 静默初始化仓库
  return exec('git init --quiet', execOption)
    // 添加远程仓库
    .then(() => exec(`git remote add origin https://github.com/${owner}/${project}`, execOption), callback)
    // 拉取仓库代码
    .then(() => exec(`git pull origin --quiet ${branch} --depth 1`, execOption), callback)
    // 删除仓库信息
    .then(() => rmdir(resolve(output, '.git')), callback);
}
