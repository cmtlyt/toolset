import type { State } from '$/types';
import { chdir, createOutput, cwd, exec, existsSync, mv, resolve, rmdir, writeFile } from '$/utils';

export async function downloadPartial(state: State) {
  const { gitInfo, callback } = state;
  const { pathname, sourceType, branch, owner, project } = gitInfo;

  const outputPath = cwd();
  // 创建临时输出目录
  const tempPath = resolve(outputPath, `./.git-down-temp-folder-${Date.now()}`);
  if (existsSync(tempPath)) {
    rmdir(tempPath);
  }
  await createOutput(tempPath).catch(callback);

  // 判断是否为文件路径
  const sparsePath = sourceType === 'file' ? pathname : `${pathname}/*`;
  const targetPath = resolve(outputPath, pathname.split('/').pop()!);

  // 切换到临时目录
  chdir(tempPath);

  // 初始化仓库
  return exec(`git init --quiet`)
    .then(() => exec(`git remote add origin https://github.com/${owner}/${project}`), callback)
    .then(() => exec(`git config core.sparseCheckout true`), callback)
    .then(() => writeFile('.git/info/sparse-checkout', sparsePath), callback)
    .then(() => exec(`git pull origin --quiet ${branch} --depth 1`), callback)
    .then(() => mv(pathname, targetPath), callback)
    .then(() => rmdir(tempPath), callback);
}
