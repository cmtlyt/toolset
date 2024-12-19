import type { LoggerConfigObj } from 'src/types';

export const fontStyle = `line-height:1.5;`;
export const lineBreakStyle = `${fontStyle}`;

export const defaultConf: LoggerConfigObj = {
  info: {
    kind: 'info',
    tagColor: '#000',
    tagBg: '#d9d9d9',
    contentColor: '#000',
    contentBg: '#fff',
    borderColor: '#d9d9d9',
  },
  warn: {
    kind: 'warn',
    tagColor: '#fff',
    tagBg: '#fa8c16',
    contentColor: '#000',
    contentBg: '#fff',
    borderColor: '#fa8c16',
  },
  error: {
    kind: 'error',
    tagColor: '#fff',
    tagBg: '#f5222d',
    contentColor: '#000',
    contentBg: '#fff',
    borderColor: '#f5222d',
  },
  debug: {
    kind: 'debug',
    tagColor: '#fff',
    tagBg: '#eb2f96',
    contentColor: '#000',
    contentBg: '#fff',
    borderColor: '#eb2f96',
  },
  success: {
    kind: 'success',
    tagColor: '#fff',
    tagBg: '#389e0d',
    contentColor: '#000',
    contentBg: '#fff',
    borderColor: '#389e0d',
  },
};
