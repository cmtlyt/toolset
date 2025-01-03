import type { ContentInfo, Kind, LoggerConfig, LoggerConfigObj, LoggerOptions } from '../types';
import { getContentInfo, getLineWidth, getTrace, joinContentInfo } from '.';

import { defaultConf, fontStyle, lineBreakStyle } from '../constant';
import { LogThrow } from '../types';

export function generateLoggerConfig(logConfig?: Partial<LoggerConfigObj>): LoggerConfigObj {
  const conf = { ...defaultConf };
  if (logConfig) {
    const keys = Object.keys(logConfig).sort() as Kind[];
    keys.forEach((key) => {
      const item = logConfig[key] as LoggerConfig;
      const { inherit, ...userConf } = item;
      if (inherit) {
        const inheritConf = conf[inherit as Kind];
        Object.assign(item, { ...inheritConf, ...userConf });
      }
      if (key in conf)
        Object.assign(conf[key as Kind], item);
      else conf[key as Kind] = item;
    });
  }
  return conf;
}

export function generateContentStyles(contentInfo: ContentInfo[], baseContentStyle: string) {
  return contentInfo.length === 1
    ? [baseContentStyle]
    : contentInfo
        .map((_, idx) => {
          if (idx === 0) {
            return [`${baseContentStyle}border-radius:0 0.4rem 0 0;`];
          }
          if (idx === contentInfo.length - 1) {
            return [lineBreakStyle, `${baseContentStyle}border-top:none;border-top-right-radius:0;`];
          }
          return [lineBreakStyle, `${baseContentStyle}border-top:none;border-radius:0;`];
        })
        .flat();
}

export function generateMessage(userConfig: LoggerOptions, logConf: LoggerConfig, messages: unknown[]): string[] {
  const { needTrace: globalNeedTrace, noOutput: globalNoOutput } = userConfig;
  const {
    kind,
    tagColor,
    tagBg,
    contentColor,
    contentBg,
    borderColor,
    style,
    noOutput = globalNoOutput,
    needTrace = globalNeedTrace,
  } = logConf;
  if (noOutput)
    throw LogThrow.NO_OUTPUT;

  const tag = `${kind.toUpperCase()}`;
  const contentInfo = getContentInfo(messages);
  const shareStyle = `${fontStyle}padding:0.1rem 0.4rem;border:0.1rem solid ${borderColor};`;
  const { tagStyle, contentStyle } = style?.(logConf) || {
    tagStyle: `${shareStyle}color:${tagColor};background:${tagBg};border-radius:0.4rem 0.4rem 0 0;`,
    contentStyle: `${shareStyle}margin-top:-0.12rem;color:${contentColor};background:${contentBg};border-radius:0 0.4rem 0.4rem;`,
  };
  const lineWidth = getLineWidth(contentInfo);
  const contentStyles = generateContentStyles(contentInfo, contentStyle);
  const finishedContent = joinContentInfo(contentInfo, lineWidth);

  let message = `%c${tag}%c\n%c${finishedContent}`;
  const styles = [tagStyle, lineBreakStyle, ...contentStyles];

  if (needTrace) {
    const trace = getTrace();
    const traceTagStyle = `${tagStyle}margin-top:0.2rem;border-radius:0.4rem 0.4rem 0 0;`;
    const traceStyle = `${contentStyle}`;

    message += `%c\n%cTRACE%c\n%c${trace}`;
    styles.push(lineBreakStyle, traceTagStyle, lineBreakStyle, traceStyle);
  }

  return [message, ...styles];
}
