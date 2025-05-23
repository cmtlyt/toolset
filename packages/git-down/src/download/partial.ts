import type { State } from '$/types';
import { createOutput, exec, existsSync, moveOrCopyAndCleanup, readFile, resolve, rmdir, writeFile } from '$/utils';

export async function downloadPartial(state: State) {
  const { gitInfo, callback, option } = state;
  const { output } = option;
  const { pathname, sourceType, branch, owner, project } = gitInfo;

  // 创建临时输出目录
  const tempPath = resolve(output, `./.git-down-temp-folder-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  if (existsSync(tempPath)) {
    rmdir(tempPath);
  }
  await createOutput(tempPath).catch(callback);

  const sparseCheckoutPath = resolve(tempPath, '.git/info/sparse-checkout');

  // 判断是否为文件路径
  const sparsePath = sourceType === 'file' ? pathname : `${pathname}/*`;
  const oldSparseContent = existsSync(sparseCheckoutPath) ? await readFile(sparseCheckoutPath, { encoding: 'utf-8' }) : '';
  const sparseChecoutFile = `${oldSparseContent}\n${sparsePath}`;

  const targetPath = resolve(output, pathname.split('/').pop()!);

  const execOption = { cwd: tempPath };

  // 使用随机远程名, 防止输出目录远程地址冲突
  const randomRemoteName = `remote-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // 初始化仓库
  return exec(`git init --quiet`, execOption)
    .then(() => exec(`git remote add ${randomRemoteName} https://github.com/${owner}/${project}`, execOption), callback)
    .then(async () => {
      try {
        const result = await exec(`git config --get core.sparseCheckout`, execOption);
        if (result.stdout.trim() === 'true')
          return;
      }
      catch {}
      return exec(`git config core.sparseCheckout true`, execOption);
    }, callback)
    .then(() => writeFile(sparseCheckoutPath, sparseChecoutFile), callback)
    .then(() => exec(`git pull ${randomRemoteName} --quiet ${branch} --depth 1`, execOption), callback)
    .then(() => moveOrCopyAndCleanup(resolve(tempPath, pathname), targetPath, callback), callback)
    .then(() => rmdir(tempPath), callback);
}
