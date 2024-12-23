import type { ContentInfo } from '../types';

import { formatContent } from './format';

export * from './format';

// 判断是否为双字节字符
export function hasDoubleByteChar(char: string) {
  if (char.length === 1) {
    const charCode = char.charCodeAt(0);
    return charCode > 255;
  }
  // eslint-disable-next-line no-control-regex
  return /[^\x00-\xFF]/.test(char);
}

export function joinContentInfo(contentInfo: ContentInfo[], lineWidth: number) {
  return contentInfo.map(info => `${info.text}${' '.repeat(Math.max(0, lineWidth - info.length))}`).join('%c\n%c');
}

export function getLineWidth(contentInfo: ContentInfo[]) {
  if (contentInfo.length > 1 && contentInfo.some(info => info.hasChinese))
    return 1000;
  return Math.max(10, Math.max(...contentInfo.map(info => info.length)));
}

export function getTrace() {
  const stack = new Error(' ').stack;
  if (!stack)
    return '';
  const lines = stack.split('\n');
  const findWrapperIndex = lines.findIndex(line => line.includes('Proxy')) + 1;
  if (!findWrapperIndex)
    return '无法正确读取位置请使用实例调用, 如需解构请使用bind将this指向实例';
  const line = lines[findWrapperIndex];
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const match = line.match(/at\s.*?\((.*?)\)/);
  if (!match)
    return line;
  return match[1];
}

export function getContentInfo(args: unknown[]): ContentInfo[] {
  return args
    .map(item => formatContent(item, void 0, true))
    .join(' ')
    .split('\n')
    .map((text) => {
      // TODO:尽量能正确获取宽度或者找到中英文等宽字体
      let length = 0;
      let hasChinese = false;
      for (let i = 0, char = text[i]; i < text.length; char = text[++i]) {
        if (hasDoubleByteChar(char)) {
          length += 2;
          hasChinese = true;
        }
        else {
          length += 1;
        }
      }
      return { text, length, hasChinese };
    });
}
