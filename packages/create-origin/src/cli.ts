import { createCommand, Option, program } from 'commander';
import { version } from '../package.json';
import { createHandler } from './cli/create';
import { downloadTemplateConfig } from './cli/download-template-config';
import { optionPrompt } from './cli/option-prompt';
import { templateManagerHandler } from './cli/template-manager';
import { updateOriginConfig } from './cli/update-origin-config';
import { SUPPORT_BUILDERS, SUPPORT_FRAMES } from './constant';
import { Registry } from './types';
import { throwError } from './utils/try-call';

function parseBoolean(value: string) {
  if (value === 'false')
    return false;
  return true;
}

const generateCommand = createCommand()
  .name('create')
  .description('使用 origin 创建一个新项目')
  .argument('[projectName]', '项目名称')
  .version(version)
  .option('-p, --package', '创建一个 npm 包', parseBoolean)
  // ^ 基础配置
  // 构建器
  .addOption(new Option('--builder <builder>', '构建器').choices(SUPPORT_BUILDERS))
  // 框架
  .addOption(new Option('--frame <frame>', '框架').choices(SUPPORT_FRAMES))
  // ^ 扩展配置
  // eslint
  .option('--eslint [enableEslint]', '是否启用 eslint (default: true)', parseBoolean)
  // prettier
  .option('--prettier [enablePrettier]', '是否启用 prettier (default: false)', parseBoolean)
  // typescript
  .option('--typescript [enableTypeScript]', '是否启用 typescript (default: true)', parseBoolean)
  // ^ 额外配置
  // 包管理器
  .addOption(new Option('-m, --package-manager <packageManager>', '包管理器 (默认为执行命令时的包管理器)').choices(['npm', 'yarn', 'pnpm']))
  // 自动安装依赖
  .option('-i, --auto-install', '自动安装依赖 (default: false)', parseBoolean)
  // 依赖使用最新版本
  .option('-l, --use-latest-package', '所有依赖均使用最新版本 (default: false)', parseBoolean)
  .option('--no-git', '不使用 git 初始化 (default: false)', parseBoolean)
  // 模板下载地址
  .addOption(new Option('--registry', '模板下载地址').choices(Object.keys(Registry)))
  .option('-t, --template <templateId>', '使用模板创建项目')
  .action(async function () {
    const [projectName] = this.args;
    const options = this.opts();

    const cliOptions = {
      builderId: options.builder,
      frameId: options.frame,
      isPackage: options.package,
      projectName,
      enableEslint: options.eslint,
      enablePrettier: options.prettier,
      enableTypeScript: options.typescript,
      packageManager: options.packageManager,
      autoInstall: options.autoInstall,
      useLatestPackage: options.useLatestPackage,
      registry: options.registry,
    };

    await createHandler.call(this, cliOptions, options.template);
  });

program.addCommand(generateCommand);

const fetchCommand = createCommand()
  .name('fetch')
  .description('获取 origin 模板信息')
  .option('-c, --config', '获取 origin 配置', parseBoolean)
  .option('-t, --template', '获取模板配置文件', parseBoolean)
  .option('-a, --all', '获取所有配置', parseBoolean)
  .addOption(new Option('--registry', '模板下载地址').choices(Object.keys(Registry)).default(Registry.github))
  .action(async function () {
    const { config, template, all, registry } = this.opts();
    if (!(config || all || template)) {
      throwError('请选择获取配置');
    }
    if (all || config) {
      await updateOriginConfig();
    }
    if (all || template) {
      await downloadTemplateConfig(registry);
    }
  });

program.addCommand(fetchCommand);

const templateManagerCommand = createCommand()
  .name('template')
  .description('模板管理')
  .option('-l, --list', '获取模板列表', parseBoolean)
  .option('-d, --delete <templateName>', '删除模板')
  .option('-c, --create <templateName>', '创建模板')
  .option('--clear', '清空模板', parseBoolean)
  .action(templateManagerHandler);

program.addCommand(templateManagerCommand);

program.parse();
