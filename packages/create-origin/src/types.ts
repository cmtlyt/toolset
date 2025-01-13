/** 打包工具 id */
export enum Builder {
  vite = 'vite',
  webpack = 'webpack',
  rolldown = 'rolldown',
  rsbuild = 'rsbuild',
}

/** 模板 id */
export enum Template {
  react = 'react',
  vue = 'vue',
  preact = 'preact',
  svelte = 'svelte',
  solid = 'solid',
}

/** 项目生成相关配置 */
export interface ProjectConfig {
  /** 项目名称 */
  projectName?: string;
  /** 打包工具 id */
  builderId?: Builder;
  /** 模板 id */
  templateId?: Template;
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
