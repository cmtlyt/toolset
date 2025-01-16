import type { GitDownOption, State } from './types';
import { downloadMain } from './download/main';
import { downloadPartial } from './download/partial';
import { buildCallback, buildOption, createOutput, parseGitUrl } from './utils';

export { parseGitUrl };

/**
 * 下载 github 仓库或文件
 */
export function gitDownWithCallback(path: string, option?: GitDownOption, callback?: (error: Error | null) => void) {
  const _option = buildOption(option);
  const _callback = buildCallback(callback);
  // 获取仓库信息
  const gitInfo = parseGitUrl(path);
  const state = { option: _option, callback: _callback, gitInfo } satisfies State;
  // 创建输出目录
  createOutput(_option.output)
    .then(() => {
      // 下载仓库
      const downloadFunc = gitInfo.isRepo ? downloadMain : downloadPartial;
      return downloadFunc(state);
    }, _callback)
    // 返回结果
    .then(() => _callback(null), _callback);
}

/**
 * 下载 github 仓库或文件
 *
 * @warning 下载过程中会频繁修改执行目录, 请勿在运行期间执行文件相关操作, 除非你清楚执行目录的修改行为
 */
function gitDown(path: string, option?: GitDownOption) {
  return new Promise<void>((resolve, reject) => {
    gitDownWithCallback(path, option, (error) => {
      if (error)
        reject(error);
      else
        resolve();
    });
  });
}

export default gitDown;
