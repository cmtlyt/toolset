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

const remoteBranchesCache = new Map<string, Promise<Set<string>>>();

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
  const normalizedBranch = option?.branch?.trim();
  return {
    output: option?.output ?? './git-down',
    branch: normalizedBranch ?? '',
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
  const normalizeProject = (input: string) => input.replace(/\.git$/, '');

  const httpsMatch = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/(tree|blob)\/(.+))?/);
  const sshMatch = url.match(/^git@github\.com:([^/]+)\/([^/]+)(?:\/(tree|blob)\/(.+))?/);
  const match = httpsMatch ?? sshMatch;

  if (!match) {
    return {
      href: url,
      owner: '',
      project: normalizeProject(url),
      isRepo: true,
      sourceType: 'dir',
      branch: '',
      pathname: '',
    };
  }

  const [, owner, project, mode, rawTail = ''] = match;
  const cleanProject = normalizeProject(project);
  const tail = rawTail ? rawTail.split(/[?#]/)[0] : '';

  let branch = '';
  let pathname = '';
  if (tail) {
    const firstSlashIndex = tail.indexOf('/');
    if (firstSlashIndex === -1) {
      branch = tail;
    }
    else {
      branch = tail.slice(0, firstSlashIndex);
      pathname = tail.slice(firstSlashIndex + 1);
    }
  }

  const isRepo = !mode;
  const cleanPath = pathname.replace(/^\//, '');
  const sourceType: GitUrlInfo['sourceType'] = mode === 'blob' || (!!cleanPath && Boolean(extname(cleanPath))) ? 'file' : 'dir';

  return {
    href: url,
    owner,
    project: cleanProject,
    isRepo,
    sourceType,
    branch,
    pathname: cleanPath,
  };
}

/**
 * 去除路径左侧的多余斜杠，避免拼接时出现重复分隔符
 */
function trimLeadingSlash(value: string) {
  return value.replace(/^\/+/, '');
}

/**
 * 去除路径两端的斜杠，保证比较时使用统一格式
 */
function trimSurroundingSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, '');
}

/**
 * 根据显式分支信息修正 gitInfo，确保分支与路径在多级分支场景下保持一致
 */
export function reconcileGitInfoBranch(gitInfo: GitUrlInfo, targetBranch: string) {
  if (!targetBranch)
    return;

  const originalBranch = trimSurroundingSlashes(gitInfo.branch);
  const normalizedTarget = trimSurroundingSlashes(targetBranch);

  gitInfo.branch = normalizedTarget;

  const normalizedPath = trimLeadingSlash(gitInfo.pathname);

  if (!normalizedPath)
    return;

  if (normalizedPath === normalizedTarget) {
    gitInfo.pathname = '';
    return;
  }

  if (normalizedPath.startsWith(`${normalizedTarget}/`)) {
    gitInfo.pathname = normalizedPath.slice(normalizedTarget.length + 1);
    return;
  }

  if (!originalBranch || originalBranch === normalizedTarget)
    return;

  if (!normalizedTarget.startsWith(`${originalBranch}/`))
    return;

  const remainder = normalizedTarget.slice(originalBranch.length);
  const normalizedRemainder = trimSurroundingSlashes(remainder);

  if (!normalizedRemainder)
    return;

  if (normalizedPath === normalizedRemainder) {
    gitInfo.pathname = '';
    return;
  }

  if (normalizedPath.startsWith(`${normalizedRemainder}/`)) {
    gitInfo.pathname = normalizedPath.slice(normalizedRemainder.length + 1);
  }
}

async function fetchRemoteBranchSet(owner: string, project: string): Promise<Set<string>> {
  const cacheKey = `${owner}/${project}`;
  if (remoteBranchesCache.has(cacheKey))
    return remoteBranchesCache.get(cacheKey)!;

  const promise = exec(`git ls-remote --heads https://github.com/${owner}/${project}`)
    .then(({ stdout }) => {
      const set = new Set<string>();
      const refsHeadsPattern = /^refs\/heads\/(.+)$/;
      stdout.split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .forEach((line) => {
          const [, ref] = line.split(/\s+/);
          if (!ref)
            return;
          const match = ref.match(refsHeadsPattern);
          if (match?.[1])
            set.add(match[1]);
        });
      return set;
    })
    .catch(() => new Set<string>());

  remoteBranchesCache.set(cacheKey, promise);
  return promise;
}

export async function resolveBranchFromRemote(
  gitInfo: GitUrlInfo,
  explicitBranch?: string,
  fetcher: (owner: string, project: string) => Promise<Set<string>> = fetchRemoteBranchSet,
) {
  const normalizedExplicit = explicitBranch?.trim();
  if (normalizedExplicit)
    return normalizedExplicit;

  const normalizedBranch = trimSurroundingSlashes(gitInfo.branch);
  if (!normalizedBranch)
    return gitInfo.branch;

  if (!gitInfo.owner || !gitInfo.project)
    return gitInfo.branch;

  if (!gitInfo.pathname)
    return gitInfo.branch;

  const pathSegments = gitInfo.pathname.split('/').filter(Boolean);
  if (!pathSegments.length)
    return gitInfo.branch;

  let branches: Set<string>;
  try {
    branches = await fetcher(gitInfo.owner, gitInfo.project);
  }
  catch {
    return gitInfo.branch;
  }

  if (!branches.size)
    return gitInfo.branch;

  for (let includeCount = pathSegments.length - 1; includeCount >= 0; includeCount--) {
    const branchCandidate = trimSurroundingSlashes([normalizedBranch, ...pathSegments.slice(0, includeCount)].join('/'));
    if (!branchCandidate)
      continue;

    if (!branches.has(branchCandidate))
      continue;

    const candidatePathSegments = pathSegments.slice(includeCount);
    if (!candidatePathSegments.length)
      continue;

    gitInfo.branch = branchCandidate;
    gitInfo.pathname = candidatePathSegments.join('/');
    return gitInfo.branch;
  }

  return gitInfo.branch;
}

export async function moveOrCopyAndCleanup(sourcePath: string, targetPath: string) {
  // 如果目标路径已存在，使用复制
  if (existsSync(targetPath)) {
    return cp(sourcePath, targetPath, { recursive: true });
  }
  else {
    // 如果目标不存在，使用移动（重命名）
    return rename(sourcePath, targetPath);
  }
}
