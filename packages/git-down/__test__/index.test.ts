import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, inject, it } from 'vitest';
import { createOutput, cwd, rmdir } from '../src/utils';

const tempFolder = resolve(cwd(), './git-down-test-temp-folder');

beforeEach(async () => {
  await rmdir(tempFolder);
  await createOutput(tempFolder);
});

afterEach(async () => {
  await rmdir(tempFolder);
});

describe.skipIf(inject('GIT_PRE_COMMIT'))('git down test', async () => {
  const utils = await (async () => {
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

  it('gitDown file', async () => {
    const { default: gitDown } = utils;

    await gitDown('https://github.com/cmtlyt/toolset/blob/main/packages/base/README.md', { output: tempFolder });
    expect(existsSync(resolve(tempFolder, 'README.md'))).toBe(true);
  }, 30 * 1000);

  it('gitDown dir', async () => {
    const { default: gitDown } = utils;
    await gitDown('https://github.com/cmtlyt/toolset/tree/main/packages/base/src/common', { output: tempFolder });
    expect(existsSync(resolve(tempFolder, 'common'))).toBe(true);
    expect(existsSync(resolve(tempFolder, 'common/constant.ts'))).toBe(true);
    expect(existsSync(resolve(tempFolder, 'common/index.ts'))).toBe(true);
    expect(existsSync(resolve(tempFolder, 'common/warning.ts'))).toBe(true);
  }, 30 * 1000);

  it('gitDown repo', async () => {
    const { default: gitDown } = utils;
    await gitDown('http://github.com/cmtlyt/test', { output: tempFolder });
    expect(existsSync(resolve(tempFolder, 'README.md'))).toBe(true);
    expect(existsSync(resolve(tempFolder, 'LICENSE'))).toBe(true);
    expect(existsSync(resolve(tempFolder, '.gitignore'))).toBe(true);
    expect(readFileSync(resolve(tempFolder, 'README.md'), 'utf-8')).toMatch(/# test/g);
  }, 30 * 1000);

  it('parseGitUrl', () => {
    const { parseGitUrl } = utils;
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
