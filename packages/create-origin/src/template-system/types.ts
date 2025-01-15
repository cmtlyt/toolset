import type { TemplateState } from '$/types';
import type { DownloadTempalteFunc } from './utils';

export interface TemplateInfoBase {
  path: string;
  content?: string;
  localPath?: string;
  loader: (download: DownloadTempalteFunc) => ReturnType<DownloadTempalteFunc>;
}

export interface FinishedTemplateInfo {
  /** 模板内容 */
  content: string;
  /** 模板本地连接 */
  localPath: string;
  /** 模板远程地址 */
  path: string;
  /** 文件路径 */
  filePath: string;
}

export interface TemplateInfoWithParse extends TemplateInfoBase {
  parse: (content: any, config: TemplateState) => string;
}

export interface TemplateInfoWithSource extends TemplateInfoBase {
  filePath: string;
}

export type TemplateInfo = (TemplateInfoWithParse | TemplateInfoWithSource);
