import { describe, expect, it } from 'vitest';
import { parseGitUrl } from '../src/utils';

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
});
