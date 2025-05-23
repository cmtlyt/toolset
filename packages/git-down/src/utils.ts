import type { Callback, GitDownOption, GitUrlInfo } from './types';
import { exec as execWithCallback } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, mkdir, rename, rm } from 'node:fs/promises';
import { extname } from 'node:path';

import { promisify } from 'node:util';

export { rename as mv, readFile, writeFile } from 'node:fs/promises';
export { resolve } from 'node:path';
export { existsSync };

export const exec = promisify(execWithCallback);

export async function createOutput(path: string) {
  if (existsSync(path))
    return;
  return mkdir(path, { recursive: true });
}

export async function rmdir(path: string) {
  if (!existsSync(path))
    return;
  return rm(path, { recursive: true, force: true }).catch(() => {});
}

export function buildOption(option?: GitDownOption): Required<GitDownOption> {
  return {
    output: './git-down',
    branch: 'main',
    ...option,
  };
}

export function buildCallback(callback?: Callback) {
  return (error: Error | null) => {
    if (error) {
      if (!callback)
        throw error;
      callback(error);
    }
    if (callback) {
      callback(null);
    }
  };
}

export function parseGitUrl(url: string): GitUrlInfo {
  const pathname = url.replace(/(^https?:\/\/github\.com\/)|(^git@github\.com:)/, '/');
  const [, owner, project, , branch = '', ...filePaths] = pathname.split('/');

  const filePath = filePaths.join('/');
  const isFile = pathname.includes('blob') || Boolean(extname(filePath));

  return {
    href: url,
    owner,
    project: project.replace(/\.git$/, ''),
    isRepo: pathname.endsWith('.git') || (!pathname.includes('tree') && !pathname.includes('blob')),
    sourceType: isFile ? 'file' : 'dir',
    branch,
    pathname: filePath,
  };
}

export async function moveOrCopyAndCleanup(sourcePath: string, targetPath: string) {
  // 如果目标路径已存在，使用复制
  if (existsSync(targetPath)) {
    await cp(sourcePath, targetPath, { recursive: true });
  }
  else {
    // 如果目标不存在，使用移动（重命名）
    await rename(sourcePath, targetPath);
  }
}
