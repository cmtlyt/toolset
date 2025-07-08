import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createOutput, rmdir } from '../src/utils';

const tempFolder = resolve(process.cwd(), './cli-test-temp-folder');
const binPath = join(__dirname, '..', 'bin', 'cli.mjs');

/**
 * 执行CLI命令并返回输出
 * @param repoUrl 仓库链接URL
 * @param options 其他参数选项
 * @returns 命令执行输出结果
 */
function runCLI(repoUrl: string, options: string = ''): string {
  try {
    const command = `node ${binPath} ${repoUrl} ${options}`;
    // 执行CLI命令
    return execSync(command, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }
  catch (error: any) {
    console.error('CLI执行错误:', error.message);
    return error.stdout || error.stderr || '';
  }
}

beforeEach(async () => {
  await rmdir(tempFolder);
  await createOutput(tempFolder);
});

afterEach(async () => {
  await rmdir(tempFolder);
});

describe('gd CLI测试', () => {
  // 下载功能测试
  describe('下载功能测试', () => {
    // master分支测试
    describe('master分支', () => {
      it('应该成功下载master分支目录', async () => {
        const repoUrl = 'https://github.com/snailuu/gd-cli-test-store/tree/master';
        const outputDir = resolve(tempFolder, 'gd-cli-test-store');

        runCLI(repoUrl, `-o ${outputDir}`);
        // 验证文件是否下载成功
        expect(existsSync(outputDir)).toBe(true);
        expect(existsSync(resolve(outputDir, 'main.md'))).toBe(true);
      });

      it('应该成功下载master分支特定文件', async () => {
        const fileUrl = 'https://github.com/snailuu/gd-cli-test-store/blob/master/src/index.ts';
        const outputDir = resolve(tempFolder, 'gd-cli-test-store');

        runCLI(fileUrl, `-o ${outputDir}`);

        // 验证文件是否下载成功
        expect(existsSync(resolve(outputDir, 'index.ts'))).toBe(true);
      });
    });

    // dev分支测试
    describe('dev分支', () => {
      it('应该成功下载dev分支目录', async () => {
        const repoUrl = 'https://github.com/snailuu/gd-cli-test-store/tree/dev';
        const outputDir = resolve(tempFolder, 'gd-cli-test-store');

        runCLI(repoUrl, `-o ${outputDir}`);

        // 验证文件是否下载成功
        expect(existsSync(outputDir)).toBe(true);
        expect(existsSync(resolve(outputDir, 'dev.md'))).toBe(true);
      });

      it('应该成功下载dev分支特定文件', async () => {
        const fileUrl = 'https://github.com/snailuu/gd-cli-test-store/blob/dev/src/dev.ts';
        const outputDir = resolve(tempFolder, 'gd-cli-test-store');

        runCLI(fileUrl, `-o ${outputDir}`);

        // 验证文件是否下载成功
        expect(existsSync(resolve(outputDir, 'dev.ts'))).toBe(true);
      });
    });
  });
});
