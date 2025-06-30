import type { ArgsDef, ParsedArgs } from 'citty';
import type { GitDownOption } from '../types';
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { exit, stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline';
import gitDown, { parseGitUrl } from '../index';

/**
 * CLI 参数定义
 */
export interface GitDownArgsDef extends ArgsDef {
  url: {
    type: 'positional';
    description: 'GitHub 仓库URL或文件/目录URL';
    required: true;
  };
  output: {
    type: 'string';
    description: '指定完整的输出路径，支持相对或绝对路径 (例如: ./path 或 /path)';
    alias: ['o', 'out'];
  };
  branch: {
    type: 'string';
    description: '指定要下载的分支名称';
    alias: ['b'];
    default: 'main';
  };
  help: {
    type: 'boolean';
    description: '显示帮助信息';
    alias: ['h'];
    default: false;
  };
  name: {
    type: 'positional';
    description: '简便方式：指定输出文件夹名称 (类似 git clone 的用法)';
    required: false;
  };
}

/**
 * 解析后的 CLI 参数类型
 */
export type GitDownParsedArgs = ParsedArgs<GitDownArgsDef>;

/**
 * 验证 URL 参数
 */
function validateUrl(url: unknown): url is string {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // 基本的 GitHub URL 验证
  const githubUrlPattern = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/;
  return githubUrlPattern.test(url);
}

/**
 * 安全地获取字符串类型的参数值
 */
function getStringArg(value: string | boolean | string[] | undefined, defaultValue: string): string {
  if (typeof value === 'string') {
    return value;
  }
  return defaultValue;
}

/**
 * 验证和获取URL参数
 */
function validateAndGetUrl(args: GitDownParsedArgs): string {
  const url = args.url || args._[0];

  if (!url) {
    console.error('❌ 错误: 必须提供URL参数');
    console.log('使用 --help 查看使用说明');
    exit(1);
  }

  if (!validateUrl(url)) {
    console.error('❌ 错误: GitHub URL格式无效');
    console.log('请提供有效的GitHub仓库、文件或目录URL');
    exit(1);
  }

  return url;
}

/**
 * 询问用户是否删除已存在的目录
 */
async function promptForDirectoryDeletion(dirPath: string): Promise<boolean> {
  const rl = createInterface({
    input: stdin,
    output: stdout,
  });

  return new Promise<boolean>((resolve) => {
    rl.question(`目录 "${dirPath}" 已存在。是否删除? (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

/**
 * 处理并生成输出路径
 */
async function processOutputPath(args: GitDownParsedArgs, gitInfo: ReturnType<typeof parseGitUrl>): Promise<string> {
  const customName = typeof args.name === 'string' ? args.name : gitInfo.project;
  const output = getStringArg(args.output, `./${customName || gitInfo.project}`);

  if (existsSync(output)) {
    console.log(`⚠️ 警告: 输出目录已存在: ${output}`);
    const shouldDelete = await promptForDirectoryDeletion(output);

    if (shouldDelete) {
      cleanupIncompleteDownload(output);
    }
    else {
      console.log('❌ 操作取消');
      exit(1);
    }
  }

  return output;
}

/**
 * 获取分支参数
 */
function getBranchOption(args: GitDownParsedArgs, defaultBranch: string): string {
  return getStringArg(args.branch, defaultBranch);
}

/**
 * 清理不完整的下载目录
 */
function cleanupIncompleteDownload(outputPath: string): void {
  if (!outputPath)
    return;

  const absolutePath = resolve(outputPath);

  if (existsSync(absolutePath)) {
    try {
      rmSync(absolutePath, { recursive: true });
      console.log(`🗑️ 已清理不完整的下载目录: ${outputPath}`);
    }
    catch (cleanupError) {
      console.error(`⚠️ 清理目录失败: ${String(cleanupError)}`);
    }
  }
}

/**
 * 执行下载操作
 */
async function executeDownload(url: string, options: GitDownOption): Promise<void> {
  console.log(`🚀 开始从以下地址下载: ${url}`);
  console.log(`📁 输出目录: ${options.output}`);

  await gitDown(url, options);
  console.log('✅ 下载成功完成!');
}

/**
 * Git Down CLI 主函数
 */
export async function runGitDown(args: GitDownParsedArgs): Promise<void> {
  let outputPath = '';

  try {
    const url = validateAndGetUrl(args);

    const gitInfo = parseGitUrl(url);

    outputPath = await processOutputPath(args, gitInfo);

    const options: GitDownOption = {
      output: outputPath,
      branch: getBranchOption(args, gitInfo.branch || 'master'),
    };

    await executeDownload(url, options);
  }
  catch (error) {
    console.error('❌ 下载失败:', error instanceof Error ? error.message : String(error));

    cleanupIncompleteDownload(outputPath);
    exit(1);
  }
}
