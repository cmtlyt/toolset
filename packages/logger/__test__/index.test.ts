import { describe, expect, it } from 'vitest';
import { createLogger } from '../src';

describe('logger 包测试', () => {
  const logBeforeInfo: any[] = [];
  const outputMessage: any[] = [];
  const outputLoggerConfig = {
    printFunc: (...args: any) => outputMessage.push(JSON.stringify(args)),
    onLogBefore: (info: any) => logBeforeInfo.push(JSON.stringify(info)),
  };
  const logger = createLogger(outputLoggerConfig);

  it('基本打印函数测试', () => {
    logger.debug('debug 输出');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"debug","messages":["debug 输出"],"logConf":{"kind":"debug","tagColor":"#fff","tagBg":"#eb2f96","contentColor":"#000","contentBg":"#fff","borderColor":"#eb2f96"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`
      [
        "["%cDEBUG%c\\n%cdebug 输出","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
      ]
    `);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
    logger.error('error 输出');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"error","messages":["error 输出"],"logConf":{"kind":"error","tagColor":"#fff","tagBg":"#f5222d","contentColor":"#000","contentBg":"#fff","borderColor":"#f5222d"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`
      [
        "["%cERROR%c\\n%cerror 输出","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #f5222d;color:#fff;background:#f5222d;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #f5222d;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
      ]
    `);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
    logger.info('info 输出');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"info","messages":["info 输出"],"logConf":{"kind":"info","tagColor":"#000","tagBg":"#d9d9d9","contentColor":"#000","contentBg":"#fff","borderColor":"#d9d9d9"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`
      [
        "["%cINFO%c\\n%cinfo 输出 ","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #d9d9d9;color:#000;background:#d9d9d9;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #d9d9d9;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
      ]
    `);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
    logger.success('success 输出');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"success","messages":["success 输出"],"logConf":{"kind":"success","tagColor":"#fff","tagBg":"#389e0d","contentColor":"#000","contentBg":"#fff","borderColor":"#389e0d"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`
      [
        "["%cSUCCESS%c\\n%csuccess 输出","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #389e0d;color:#fff;background:#389e0d;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #389e0d;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
      ]
    `);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
    logger.warn('warn 输出');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"warn","messages":["warn 输出"],"logConf":{"kind":"warn","tagColor":"#fff","tagBg":"#fa8c16","contentColor":"#000","contentBg":"#fff","borderColor":"#fa8c16"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`
      [
        "["%cWARN%c\\n%cwarn 输出 ","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #fa8c16;color:#fff;background:#fa8c16;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #fa8c16;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
      ]
    `);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
  });

  it('异常测试', () => {
    logger.test('这会抛出警告并且使用 info 样式输出');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"test","messages":["这会抛出警告并且使用 info 样式输出"],"logConf":{"kind":"test","tagColor":"#000","tagBg":"#d9d9d9","contentColor":"#000","contentBg":"#fff","borderColor":"#d9d9d9"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`
      [
        "["%cTEST%c\\n%c这会抛出警告并且使用 info 样式输出","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #d9d9d9;color:#000;background:#d9d9d9;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #d9d9d9;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
      ]
    `);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
  });

  it('needTrace 测试', () => {
    const logger = createLogger({
      needTrace: true,
      ...outputLoggerConfig,
    });
    logger.info('info 输出');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"info","messages":["info 输出"],"logConf":{"kind":"info","tagColor":"#000","tagBg":"#d9d9d9","contentColor":"#000","contentBg":"#fff","borderColor":"#d9d9d9"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`
      [
        "["%cINFO%c\\n%cinfo 输出 %c\\n%cTRACE%c\\n%c    at /Users/cmtlyt/code/package/toolset/packages/logger/__test__/index.test.ts:103:12","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #d9d9d9;color:#000;background:#d9d9d9;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #d9d9d9;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #d9d9d9;color:#000;background:#d9d9d9;border-radius:0.4rem 0.4rem 0 0;margin-top:0.2rem;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #d9d9d9;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
      ]
    `);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
  });

  it('中断输出测试', () => {
    const logger = createLogger({
      onLogBefore: info => info.preventDefault(),
    });
    logger.info('中断输出测试');
    expect(logBeforeInfo).toMatchInlineSnapshot(`[]`);
    expect(outputMessage).toMatchInlineSnapshot(`[]`);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
  });

  it('重写输出样式测试, 保证顺序一致', () => {
    const logger = createLogger<'test' | 'customStyle'>({
      ...outputLoggerConfig,
      logConfig: {
        test: { kind: 'test', inherit: 'info' },
        info: { kind: 'info', inherit: 'debug' },
        customStyle: { kind: 'customStyle', inherit: 'info', style: styleInfo => ({ contentStyle: 'content style', tagStyle: JSON.stringify(styleInfo) }) },
      },
    });
    logger.info('info 输出');
    logger.test('test 输出');
    logger.customStyle('自定义', '输出样式');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"info","messages":["info 输出"],"logConf":{"kind":"info","tagColor":"#fff","tagBg":"#eb2f96","contentColor":"#000","contentBg":"#fff","borderColor":"#eb2f96","inherit":"debug"}}",
        "{"kind":"test","messages":["test 输出"],"logConf":{"kind":"test","inherit":"debug","tagColor":"#fff","tagBg":"#eb2f96","contentColor":"#000","contentBg":"#fff","borderColor":"#eb2f96"}}",
        "{"kind":"customStyle","messages":["自定义","输出样式"],"logConf":{"kind":"customStyle","inherit":"info","tagColor":"#000","tagBg":"#d9d9d9","contentColor":"#000","contentBg":"#fff","borderColor":"#d9d9d9"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`
      [
        "["%cINFO%c\\n%cinfo 输出 ","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
        "["%cTEST%c\\n%ctest 输出 ","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
        "["%cCUSTOMSTYLE%c\\n%c自定义 输出样式","{\\"kind\\":\\"customStyle\\",\\"inherit\\":\\"info\\",\\"tagColor\\":\\"#000\\",\\"tagBg\\":\\"#d9d9d9\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#d9d9d9\\"}","line-height:1.5;","content style"]",
      ]
    `);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
    // 调整 logConfig 顺序
    const logger2 = createLogger<'test'>({
      ...outputLoggerConfig,
      logConfig: {
        info: { kind: 'info', inherit: 'debug' },
        test: { kind: 'test', inherit: 'info' },
      },
    });
    logger2.info('info 输出');
    logger2.test('test 输出');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"info","messages":["info 输出"],"logConf":{"kind":"info","tagColor":"#fff","tagBg":"#eb2f96","contentColor":"#000","contentBg":"#fff","borderColor":"#eb2f96","inherit":"debug"}}",
        "{"kind":"test","messages":["test 输出"],"logConf":{"kind":"test","inherit":"debug","tagColor":"#fff","tagBg":"#eb2f96","contentColor":"#000","contentBg":"#fff","borderColor":"#eb2f96"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`
      [
        "["%cINFO%c\\n%cinfo 输出 ","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
        "["%cTEST%c\\n%ctest 输出 ","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem 0.4rem 0 0;","line-height:1.5;","line-height:1.5;padding:0.1rem 0.4rem;border:0.1rem solid #eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:0 0.4rem 0.4rem;"]",
      ]
    `);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
  });

  it('不输出配置', () => {
    const logger = createLogger({
      noOutput: true,
      ...outputLoggerConfig,
    });
    logger.info('info 输出');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"info","messages":["info 输出"],"logConf":{"kind":"info","tagColor":"#fff","tagBg":"#eb2f96","contentColor":"#000","contentBg":"#fff","borderColor":"#eb2f96","inherit":"debug"}}",
      ]
    `);
    expect(outputMessage).toMatchInlineSnapshot(`[]`);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
  });

  it('换行输出测试', () => {
    logger.info('换行\n输出\n测试');
    expect(logBeforeInfo).toMatchInlineSnapshot(`
      [
        "{"kind":"info","messages":["换行\\n输出\\n测试"],"logConf":{"kind":"info","tagColor":"#fff","tagBg":"#eb2f96","contentColor":"#000","contentBg":"#fff","borderColor":"#eb2f96","inherit":"debug"}}",
      ]
    `);
    expect(JSON.stringify(outputMessage).replace(/\s/g, '')).toMatchInlineSnapshot(`"["[\\"%cINFO%c\\\\n%c换行%c\\\\n%c输出%c\\\\n%c测试\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-radius:00.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-top-right-radius:0;\\"]"]"`);
    logBeforeInfo.length = 0;
    outputMessage.length = 0;
  });

  it('多类型数据输出测试', () => {
    logger.info('字符串');
  });

  // expect(logBeforeInfo).toMatchInlineSnapshot();
  // expect(outputMessage).toMatchInlineSnapshot();
});
