import { describe, expect, it } from 'vitest';
import { parseGitUrl, reconcileGitInfoBranch } from '../src/utils';

describe('utils test', () => {
  it('parseGitUrl', () => {
    expect(parseGitUrl('https://github.com/cmtlyt/git-down')).toEqual({
      href: 'https://github.com/cmtlyt/git-down',
      isRepo: true,
      pathname: '',
      sourceType: 'dir',
      branch: '',
      owner: 'cmtlyt',
      project: 'git-down',
    });
    expect(parseGitUrl('https://github.com/cmtlyt/git-down.git')).toEqual({
      href: 'https://github.com/cmtlyt/git-down.git',
      isRepo: true,
      pathname: '',
      sourceType: 'dir',
      branch: '',
      owner: 'cmtlyt',
      project: 'git-down',
    });
    expect(parseGitUrl('https://github.com/cmtlyt/git-down/blob/main/README.md')).toEqual({
      href: 'https://github.com/cmtlyt/git-down/blob/main/README.md',
      isRepo: false,
      pathname: 'README.md',
      sourceType: 'file',
      branch: 'main',
      owner: 'cmtlyt',
      project: 'git-down',
    });
    expect(parseGitUrl('https://github.com/cmtlyt/git-down/blob/main/src/index.ts')).toEqual({
      href: 'https://github.com/cmtlyt/git-down/blob/main/src/index.ts',
      isRepo: false,
      pathname: 'src/index.ts',
      sourceType: 'file',
      branch: 'main',
      owner: 'cmtlyt',
      project: 'git-down',
    });
    expect(parseGitUrl('https://github.com/cmtlyt/git-down/tree/main/src/download')).toEqual({
      href: 'https://github.com/cmtlyt/git-down/tree/main/src/download',
      isRepo: false,
      pathname: 'src/download',
      sourceType: 'dir',
      branch: 'main',
      owner: 'cmtlyt',
      project: 'git-down',
    });
    expect(parseGitUrl('git@github.com:cmtlyt/git-down.git')).toEqual({
      href: 'git@github.com:cmtlyt/git-down.git',
      isRepo: true,
      pathname: '',
      sourceType: 'dir',
      branch: '',
      owner: 'cmtlyt',
      project: 'git-down',
    });
  });

  describe('reconcileGitInfoBranch', () => {
    it('应该修正多级分支名和路径', () => {
      // 场景：parseGitUrl 把 feat/yxp-lib-start 解析为 feat + yxp-lib-start/README.md
      // 用户通过 -b 指定完整分支名后，应该修正为正确的分支和路径
      const gitInfo = {
        href: '',
        owner: '',
        project: '',
        isRepo: false,
        sourceType: 'file' as const,
        branch: 'feat',
        pathname: 'yxp-lib-start/README.md',
      };

      reconcileGitInfoBranch(gitInfo, 'feat/yxp-lib-start');

      expect(gitInfo.branch).toBe('feat/yxp-lib-start');
      expect(gitInfo.pathname).toBe('README.md');
    });

    it('应该处理路径等于分支余下部分的情况', () => {
      // 场景：pathname 恰好等于分支名去掉第一层后的部分
      const gitInfo = {
        href: '',
        owner: '',
        project: '',
        isRepo: false,
        sourceType: 'dir' as const,
        branch: 'feat',
        pathname: 'feature-name',
      };

      reconcileGitInfoBranch(gitInfo, 'feat/feature-name');

      expect(gitInfo.branch).toBe('feat/feature-name');
      expect(gitInfo.pathname).toBe('');
    });

    it('应该去除分支名开头和结尾的斜杠', () => {
      const gitInfo = {
        href: '',
        owner: '',
        project: '',
        isRepo: false,
        sourceType: 'dir' as const,
        branch: 'feat',
        pathname: 'branch-name',
      };

      reconcileGitInfoBranch(gitInfo, '/feat/branch-name/');

      expect(gitInfo.branch).toBe('feat/branch-name');
      expect(gitInfo.pathname).toBe('');
    });
  });
});
