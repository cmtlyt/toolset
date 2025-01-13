import type { State } from '$/types';
import { exec, rmdir } from '$/utils';

export function downloadMain(state: State) {
  const { gitInfo, option, callback } = state;
  const { branch } = option;
  const { owner, project } = gitInfo;
  // 静默初始化仓库
  return exec('git init --quiet')
    // 添加远程仓库
    .then(() => exec(`git remote add origin https://github.com/${owner}/${project}`), callback)
    // 拉取仓库代码
    .then(() => exec(`git pull origin --quiet ${branch} --depth 1`), callback)
    // 删除仓库信息
    .then(() => rmdir('.git'), callback);
}
