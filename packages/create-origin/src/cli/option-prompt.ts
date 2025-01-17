import { ICON_MAP } from '$/constant/icon';
import { Builder, Frame, PackageManager, type ProjectConfig, Registry } from '$/types';
import { colorize } from '$/utils/colorize';
import { addUserTemplateConfig, downloadTemplateExists, getOriginConfig, getUserTemplateConfig } from '$/utils/origin-config';
import { print } from '$/utils/print';
import { throwError } from '$/utils/try-call';
import prompts from 'prompts';
import yoctoSpinner from 'yocto-spinner';
import { createPackage, createProject } from '..';
import { autoInstall } from './auto-install';
import { downloadTemplateConfig } from './download-template-config';
import { initGitRepo } from './init-git';

async function getExtendConfig(options: Partial<ProjectConfig>) {
  const config = { ...options };
  // eslint 处理
  if (!options.enableEslint) {
    const { enableEslint } = await prompts({
      name: 'enableEslint',
      type: 'confirm',
      initial: true,
      message: '是否启用 eslint',
    });
    config.enableEslint = enableEslint;
  }
  // prettier 处理
  if (!options.enablePrettier) {
    const { enablePrettier } = await prompts({
      name: 'enablePrettier',
      type: 'confirm',
      initial: false,
      message: '是否启用 prettier',
    });
    config.enablePrettier = enablePrettier;
  }
  // typescript 处理
  if (!options.enableTypeScript) {
    const { enableTypeScript } = await prompts({
      name: 'enableTypeScript',
      type: 'confirm',
      initial: true,
      message: '是否启用 typescript',
    });
    config.enableTypeScript = enableTypeScript;
  }
  return config;
}

async function getAdvancedConfig(options: Partial<ProjectConfig>) {
  const config = { ...options };
  // 自动安装依赖
  if (!options.autoInstall) {
    const { autoInstall } = await prompts({
      name: 'autoInstall',
      type: 'confirm',
      initial: false,
      message: '是否自动安装依赖',
    });
    config.autoInstall = autoInstall;
  }
  // 包管理工具
  if (config.autoInstall && !options.packageManager) {
    const { packageManager } = await prompts({
      name: 'packageManager',
      type: 'select',
      message: '请选择包管理工具',
      choices: Object.entries(PackageManager).map(([id, name]) => ({ title: name, value: id })),
    });
    config.packageManager = packageManager;
  }
  // 自动安装依赖的情况下必须指定包管理工具
  if (config.autoInstall && !config.packageManager) {
    return print(colorize`{red ${ICON_MAP.error} 自动安装依赖时必须指定包管理工具}`);
  }
  // 所有依赖包都使用最新版
  if (!options.useLatestPackage) {
    const { useLatestPackage } = await prompts({
      name: 'useLatestPackage',
      type: 'confirm',
      initial: false,
      message: '所有依赖包都使用最新版 (需要较长时间)',
    });
    config.useLatestPackage = useLatestPackage;
  }
  // 模板下载地址
  if (!options.registry) {
    const { registry } = await prompts({
      name: 'registry',
      type: 'select',
      message: '请选择模板下载地址',
      inactive: 'github',
      choices: Object.entries(Registry).map(([id, name]) => ({ title: name, value: id })),
    });
    config.registry = registry;
  }
  // 是否禁用 git
  if (!options.noGit) {
    const { noGit } = await prompts({
      name: 'noGit',
      type: 'confirm',
      initial: false,
      message: '是否禁用 git',
    });
    config.noGit = noGit;
  }
  return config;
}

async function saveTemplate(config: ProjectConfig) {
  while (true) {
    const { templateName } = await prompts({
      name: 'templateName',
      type: 'text',
      message: '请输入模板名',
    });
    if (!templateName) {
      print(colorize`{yellow ${ICON_MAP.warning} 模板名不能为空}`);
    }
    else {
      await addUserTemplateConfig(templateName, config);
      print(colorize`{green ${ICON_MAP.success} 模板 ${templateName} 保存成功}`);
      return;
    }
  }
}

export async function optionPrompt(options: Partial<ProjectConfig>) {
  const userOptions = { ...options };
  // ^ 基础配置
  // 项目名处理
  if (!options.projectName) {
    const { projectName } = await prompts({
      name: 'projectName',
      type: 'text',
      message: '请输入项目名',
    });
    if (!projectName) {
      return print(colorize`{red ${ICON_MAP.error} 项目名不能为空}`);
    }
    userOptions.projectName = projectName;
  }
  // 如果是 npm 包则不需要后续交互, 直接下载 npm 包模板
  if (options.isPackage) {
    return createPackage(userOptions);
  }
  if (!downloadTemplateExists()) {
    const { downloadTemplateFlag } = await prompts({
      name: 'downloadTemplateFlag',
      type: 'confirm',
      initial: false,
      message: '是否下载模板文件到本地, 在次创建会直接读取本地模板而不请求远程, 后续可通过 fetch 命令更新模板',
    });
    if (downloadTemplateFlag) {
      const { registry } = await prompts({
        name: 'registry',
        type: 'select',
        message: '请选择模板下载地址',
        inactive: 'github',
        choices: Object.entries(Registry).map(([id, name]) => ({ title: name, value: id })),
      });
      userOptions.registry = registry;
      await downloadTemplateConfig(registry);
    }
  }
  const userTemplateConfig = await getUserTemplateConfig();
  const userTemplateChoices = Object.entries(userTemplateConfig).map(([name, config]) => ({ title: name, value: config }));
  if (userTemplateChoices.length) {
    // 是否使用保存的配置
    const { useSaveConfig } = await prompts({
      name: 'useSaveConfig',
      type: 'confirm',
      initial: false,
      message: '是否使用保存的框架配置',
    });
    if (useSaveConfig) {
      const { userConfig } = await prompts({
        name: 'userConfig',
        type: 'select',
        message: '请选择框架配置',
        choices: userTemplateChoices,
      });
      return createProject(userConfig);
    }
  }
  let readLoacl: boolean = false;
  if (import.meta.BUILD) {
    const { readRemote } = await prompts({
      name: 'readRemote',
      type: 'confirm',
      initial: false,
      message: '是否拉取远程配置 (需请求 github)',
    });
    readLoacl = !readRemote;
  }
  const getConfigSpinner = yoctoSpinner({ text: '正在读取配置...' }).start();
  const { FRAME_SUPPORT } = await getOriginConfig(readLoacl);
  getConfigSpinner.text = '配置读取成功';
  getConfigSpinner.success();
  // 构建器处理
  if (!options.builderId) {
    const { builder } = await prompts({
      name: 'builder',
      type: 'select',
      message: '请选择构建器',
      choices: Object.entries(Builder).map(([id, name]) => {
        const frames = FRAME_SUPPORT[id as Builder] || [];
        if (!frames.length)
          return null;
        return { title: colorize`${name} {gray (${frames.join(', ')})}`, value: id };
      }).filter(item => item !== null),
    });
    if (!builder) {
      return print(colorize`{red ${ICON_MAP.error} 构建器不能为空}`);
    }
    userOptions.builderId = builder;
  }
  // 框架处理
  const supportFrame = FRAME_SUPPORT[userOptions.builderId!];
  if (!options.frameId) {
    const choices = Object.entries(Frame).map(([id, name]) => {
      if (!supportFrame.includes(id as any)) {
        return null;
      }
      return { title: name, value: id };
    }).filter(item => item !== null);
    const { frame } = await prompts({
      name: 'frame',
      type: 'select',
      message: '请选择框架',
      choices: choices.length < 1 ? [{ title: '当前脚手架没有支持的框架, 等待后续更新', value: '' }] : choices,
    });
    if (!frame) {
      return print(colorize`{red ${ICON_MAP.error} 框架不能为空}`);
    }
    userOptions.frameId = frame;
  }
  // 检查是否预设了构建器对框架的处理
  if (!supportFrame.includes(userOptions.frameId!)) {
    throwError(`脚手架没有预设 ${userOptions.builderId} 构建器对 ${userOptions.frameId} 框架的支持`);
  }

  // ? 使用默认配置或自定义配置
  const { useDefaultConfig } = await prompts({
    name: 'useDefaultConfig',
    type: 'confirm',
    initial: true,
    message: colorize`是否使用默认配置 {gray enableEslint disablePrettier enableTypeScript}`,
  });

  if (!useDefaultConfig) {
    // ^ 扩展配置
    const extendConfig = await getExtendConfig(userOptions);
    Object.assign(userOptions, extendConfig);

    // ? 是否修改高级配置
    const { modifyAdvancedConfig } = await prompts({
      name: 'modifyAdvancedConfig',
      type: 'confirm',
      initial: false,
      message: '是否修改高级配置',
    });

    if (modifyAdvancedConfig) {
      // ^ 高级配置
      const advancedConfig = await getAdvancedConfig(userOptions);
      Object.assign(userOptions, advancedConfig);
    }
  }

  const projectConfig = await createProject(userOptions);

  if (!projectConfig.noGit) {
    const spinner = yoctoSpinner({ text: '初始化 git 仓库中...' }).start();
    await initGitRepo(projectConfig.outputPath);
    spinner.text = 'git 仓库初始化完成';
    spinner.success();
  }
  if (projectConfig.autoInstall) {
    const spinner = yoctoSpinner({ text: '自动安装依赖中...' }).start();
    await autoInstall(projectConfig.outputPath, projectConfig.packageManager);
    spinner.text = '依赖安装完成';
    spinner.success();
  }

  // 使用默认配置直接跳过保存逻辑
  if (useDefaultConfig)
    return;

  // 保存模板
  const { saveTemplateFlag } = await prompts({
    name: 'saveTemplateFlag',
    type: 'confirm',
    initial: false,
    message: '是否保存模板',
  });

  if (!saveTemplateFlag)
    return;

  return saveTemplate(projectConfig);
}
