export interface GitDownOption {
  /** 输出路径 */
  output?: string;
  /** 下载的分支 */
  branch?: string;
}

export type Callback = (error: Error | null) => void;

export interface GitUrlInfo {
  href: string;
  /** 是否是仓库链接 */
  isRepo: boolean;
  /** 仓库拥有者 */
  owner: string;
  /** 仓库名称 */
  project: string;
  /** 分支 */
  branch: string;
  /** 文件路径 */
  pathname: string;
  /** 资源类型 */
  sourceType: 'file' | 'dir';
}

export interface State {
  option: Required<GitDownOption>;
  callback: Callback;
  gitInfo: GitUrlInfo;
}
