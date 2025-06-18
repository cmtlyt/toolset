import type { ArgsDef, ParsedArgs } from 'citty';
import type { GitDownOption } from '../types';
import { exit } from 'node:process';
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
    default: 'master';
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
 * Git Down CLI 主函数
 */
export async function runGitDown(args: GitDownParsedArgs): Promise<void> {
  try {
    // 获取 URL 参数（位置参数或从 _ 数组中获取）
    const url = args.url || args._[0];

    if (!url) {
      console.error('❌ Error: URL is required');
      console.log('Use --help for usage information');
      exit(1);
    }

    // 验证 URL 格式
    if (!validateUrl(url)) {
      console.error('❌ Error: Invalid GitHub URL format');
      console.log('Please provide a valid GitHub repository, file, or directory URL');
      exit(1);
    }

    // 解析URL获取详细信息
    const gitInfo = parseGitUrl(url);

    // 获取自定义名称或使用仓库名称
    const customName = typeof args.name === 'string' ? args.name : gitInfo.project;

    // 优先使用用户提供的output参数
    const outputPath = getStringArg(args.output, `./${customName || gitInfo.project}`);

    // 构建选项
    const options: GitDownOption = {
      output: outputPath,
      branch: getStringArg(args.branch, gitInfo.branch || 'master'),
    };

    console.log(`🚀 Starting download from: ${url}`);
    console.log(`📁 Output directory: ${options.output}`);

    // 执行下载
    await gitDown(url, options);

    console.log('✅ Download completed successfully!');
  }
  catch (error) {
    console.error('❌ Download failed:', error instanceof Error ? error.message : String(error));
    exit(1);
  }
}
