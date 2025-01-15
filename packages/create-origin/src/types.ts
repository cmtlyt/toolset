/** 打包工具 id */
export enum Builder {
  vite = 'vite',
  webpack = 'webpack',
  rolldown = 'rolldown',
  rsbuild = 'rsbuild',
}

/** 框架 id */
export enum Frame {
  react = 'react',
  reactSfc = 'react-sfc',
  vue = 'vue',
  vueSfc = 'vue-sfc',
  preact = 'preact',
  svelte = 'svelte',
  solid = 'solid',
  /** npm 包 */
  package = 'package',
}

export enum Registry {
  github = 'github',
  gitee = 'gitee',
}

export enum PackageManager {
  npm = 'npm',
  yarn = 'yarn',
  pnpm = 'pnpm',
}

/** 项目生成相关配置 */
export interface ProjectConfig {
  /** 项目名称 (用户输入) */
  projectName: string;
  /** 打包工具 id (用户选择) */
  builderId: Builder;
  /** 模板 id (用户选择) */
  frameId: Frame;

  // ^ 下列为扩展配置
  /** 是否启用 eslint (默认启用) */
  enableEslint: boolean;
  /** 是否启用 prettier (默认禁用) */
  enablePrettier: boolean;
  /** 是否自动安装依赖 (默认禁用) */
  autoInstall: boolean;
  /** 包管理工具 (从命令行参数或运行的命令中获取) */
  packageManager: PackageManager;
  /** 是否启用 typescript (默认启用) */
  enableTypeScript: boolean;
  /** 是否使用最新版本包 (默认禁用) */
  useLatestPackage: boolean;
  registry: Registry;

  // ^ 下列为系统注入配置
  outputPath: string;
}

/** 提交相关配置 */
export interface EmitConfig {
  /** 输出路径 */
  outputPath?: string;
}

/** 临时存储相关配置 */
export interface TempConfig {
  /** 临时存储路径 */
  tempPath?: string;
}

/** 配置 */
export type Config = ProjectConfig & EmitConfig & TempConfig;

/** 命令合集 */
export interface Scripts {
  /** 打包工具启动开发服务器 */
  builderDev: string;
  builderBuild: string;
  builderPreview?: string;
}

export interface BuilderConfig {
  framePlugin: string;
  frameName: string;
  frameImport: string;
}

export interface DepItem {
  name: string;
  version: string;
  isDev?: boolean;
  ignore?: boolean;
}

/** 用于生成模板的状态 */
export interface TemplateState {
  /** 项目名 */
  projectName: string;
  /** 打包工具 */
  builder: string;
  /** 打包工具配置 */
  builderConfig: BuilderConfig;
  /** 框架 */
  frame: string;
  /** 命令 */
  scripts: Scripts;
  /** 是否启用 eslint */
  enableEslint: boolean;
  /** 是否启用 prettier */
  enablePrettier: boolean;
  /** 是否启用 typescript */
  enableTypeScript: boolean;
  /** 生产依赖 */
  dependencies: DepItem[];
  /** 开发依赖 */
  devDependencies: DepItem[];
}
