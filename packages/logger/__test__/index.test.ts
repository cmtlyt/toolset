import { describe, expect, it } from 'vitest';
import { createLogger } from '../src';

function stringify(obj: any) {
  try {
    return JSON.stringify(obj).replace(/\s+/g, '');
  }
  catch {
    return '';
  }
}

describe('logger 包测试', () => {
  const logBeforeInfo: any[] = [];
  const outputMessage: any[] = [];
  let globalIdx = 0;
  const outputLoggerConfig = {
    onLogBefore: (info: any) => logBeforeInfo[globalIdx] = (stringify(info)),
    printFunc: (...args: any) => outputMessage[globalIdx++] = (stringify(args)),
  };
  const logger = createLogger(outputLoggerConfig);

  it('基本打印函数测试', () => {
    const idx = globalIdx;
    logger.debug('debug 输出');
    expect(stringify(logBeforeInfo[idx])).toMatchInlineSnapshot(`""{\\"kind\\":\\"debug\\",\\"messages\\":[\\"debug输出\\"],\\"logConf\\":{\\"kind\\":\\"debug\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#eb2f96\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#eb2f96\\"}}""`);
    expect(stringify(outputMessage[idx])).toMatchInlineSnapshot(`""[\\"%cDEBUG%c\\\\n%cdebug输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
    const idx2 = globalIdx;
    logger.error('error 输出');
    expect(stringify(logBeforeInfo[idx2])).toMatchInlineSnapshot(`""{\\"kind\\":\\"error\\",\\"messages\\":[\\"error输出\\"],\\"logConf\\":{\\"kind\\":\\"error\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#f5222d\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#f5222d\\"}}""`);
    expect(stringify(outputMessage[idx2])).toMatchInlineSnapshot(`""[\\"%cERROR%c\\\\n%cerror输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#f5222d;color:#fff;background:#f5222d;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#f5222d;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
    const idx3 = globalIdx;
    logger.info('info 输出');
    expect(stringify(logBeforeInfo[idx3])).toMatchInlineSnapshot(`""{\\"kind\\":\\"info\\",\\"messages\\":[\\"info输出\\"],\\"logConf\\":{\\"kind\\":\\"info\\",\\"tagColor\\":\\"#000\\",\\"tagBg\\":\\"#d9d9d9\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#d9d9d9\\"}}""`);
    expect(stringify(outputMessage[idx3])).toMatchInlineSnapshot(`""[\\"%cINFO%c\\\\n%cinfo输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#d9d9d9;color:#000;background:#d9d9d9;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#d9d9d9;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
    const idx4 = globalIdx;
    logger.success('success 输出');
    expect(stringify(logBeforeInfo[idx4])).toMatchInlineSnapshot(`""{\\"kind\\":\\"success\\",\\"messages\\":[\\"success输出\\"],\\"logConf\\":{\\"kind\\":\\"success\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#389e0d\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#389e0d\\"}}""`);
    expect(stringify(outputMessage[idx4])).toMatchInlineSnapshot(`""[\\"%cSUCCESS%c\\\\n%csuccess输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#389e0d;color:#fff;background:#389e0d;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#389e0d;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
    const idx5 = globalIdx;
    logger.warn('warn 输出');
    expect(stringify(logBeforeInfo[idx5])).toMatchInlineSnapshot(`""{\\"kind\\":\\"warn\\",\\"messages\\":[\\"warn输出\\"],\\"logConf\\":{\\"kind\\":\\"warn\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#fa8c16\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#fa8c16\\"}}""`);
    expect(stringify(outputMessage[idx5])).toMatchInlineSnapshot(`""[\\"%cWARN%c\\\\n%cwarn输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#fa8c16;color:#fff;background:#fa8c16;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#fa8c16;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
  });

  it('异常测试', () => {
    const idx = globalIdx;
    logger.test('这会抛出警告并且使用 info 样式输出');
    expect(stringify(logBeforeInfo[idx])).toMatchInlineSnapshot(`""{\\"kind\\":\\"test\\",\\"messages\\":[\\"这会抛出警告并且使用info样式输出\\"],\\"logConf\\":{\\"kind\\":\\"test\\",\\"tagColor\\":\\"#000\\",\\"tagBg\\":\\"#d9d9d9\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#d9d9d9\\"}}""`);
    expect(stringify(outputMessage[idx])).toMatchInlineSnapshot(`""[\\"%cTEST%c\\\\n%c这会抛出警告并且使用info样式输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#d9d9d9;color:#000;background:#d9d9d9;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#d9d9d9;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
  });

  it('needTrace 测试', () => {
    const logger = createLogger({
      needTrace: true,
      ...outputLoggerConfig,
    });
    const idx = globalIdx;
    logger.info('info 输出');
    expect(stringify(logBeforeInfo[idx])).toMatchInlineSnapshot(`""{\\"kind\\":\\"info\\",\\"messages\\":[\\"info输出\\"],\\"logConf\\":{\\"kind\\":\\"info\\",\\"tagColor\\":\\"#000\\",\\"tagBg\\":\\"#d9d9d9\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#d9d9d9\\"}}""`);
    expect(stringify(outputMessage[idx])).toMatchInlineSnapshot(`""[\\"%cINFO%c\\\\n%cinfo输出%c\\\\n%cTRACE%c\\\\n%catD:\\\\\\\\code\\\\\\\\@cmtlyt\\\\\\\\toolset\\\\\\\\packages\\\\\\\\logger\\\\\\\\__test__\\\\\\\\index.test.ts:59:12\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#d9d9d9;color:#000;background:#d9d9d9;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#d9d9d9;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#d9d9d9;color:#000;background:#d9d9d9;border-radius:0.4rem0.4rem00;margin-top:0.2rem;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#d9d9d9;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
  });

  it('中断输出测试', () => {
    const logger = createLogger({
      onLogBefore: info => info.preventDefault(),
    });
    const idx = globalIdx;
    logger.info('中断输出测试');
    expect(stringify(logBeforeInfo[idx])).toMatchInlineSnapshot(`""`);
    expect(stringify(outputMessage[idx])).toMatchInlineSnapshot(`""`);
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
    const idx = globalIdx;
    logger.info('info 输出');
    expect(stringify(logBeforeInfo[idx])).toMatchInlineSnapshot(`""{\\"kind\\":\\"info\\",\\"messages\\":[\\"info输出\\"],\\"logConf\\":{\\"kind\\":\\"info\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#eb2f96\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#eb2f96\\",\\"inherit\\":\\"debug\\"}}""`);
    expect(stringify(outputMessage[idx])).toMatchInlineSnapshot(`""[\\"%cINFO%c\\\\n%cinfo输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
    const idx2 = globalIdx;
    logger.test('test 输出');
    expect(stringify(logBeforeInfo[idx2])).toMatchInlineSnapshot(`""{\\"kind\\":\\"test\\",\\"messages\\":[\\"test输出\\"],\\"logConf\\":{\\"kind\\":\\"test\\",\\"inherit\\":\\"debug\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#eb2f96\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#eb2f96\\"}}""`);
    expect(stringify(outputMessage[idx2])).toMatchInlineSnapshot(`""[\\"%cTEST%c\\\\n%ctest输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
    const idx3 = globalIdx;
    logger.customStyle('自定义', '输出样式');
    expect(stringify(logBeforeInfo[idx3])).toMatchInlineSnapshot(`""{\\"kind\\":\\"customStyle\\",\\"messages\\":[\\"自定义\\",\\"输出样式\\"],\\"logConf\\":{\\"kind\\":\\"customStyle\\",\\"inherit\\":\\"info\\",\\"tagColor\\":\\"#000\\",\\"tagBg\\":\\"#d9d9d9\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#d9d9d9\\"}}""`);
    expect(stringify(outputMessage[idx3])).toMatchInlineSnapshot(`""[\\"%cCUSTOMSTYLE%c\\\\n%c自定义输出样式\\",\\"{\\\\\\"kind\\\\\\":\\\\\\"customStyle\\\\\\",\\\\\\"inherit\\\\\\":\\\\\\"info\\\\\\",\\\\\\"tagColor\\\\\\":\\\\\\"#000\\\\\\",\\\\\\"tagBg\\\\\\":\\\\\\"#d9d9d9\\\\\\",\\\\\\"contentColor\\\\\\":\\\\\\"#000\\\\\\",\\\\\\"contentBg\\\\\\":\\\\\\"#fff\\\\\\",\\\\\\"borderColor\\\\\\":\\\\\\"#d9d9d9\\\\\\"}\\",\\"line-height:1.5;\\",\\"contentstyle\\"]""`);
    // 调整 logConfig 顺序
    const logger2 = createLogger<'test'>({
      ...outputLoggerConfig,
      logConfig: {
        info: { kind: 'info', inherit: 'debug' },
        test: { kind: 'test', inherit: 'info' },
      },
    });
    const idx4 = globalIdx;
    logger2.info('info 输出');
    expect(stringify(logBeforeInfo[idx4])).toMatchInlineSnapshot(`""{\\"kind\\":\\"info\\",\\"messages\\":[\\"info输出\\"],\\"logConf\\":{\\"kind\\":\\"info\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#eb2f96\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#eb2f96\\",\\"inherit\\":\\"debug\\"}}""`);
    expect(stringify(outputMessage[idx4])).toMatchInlineSnapshot(`""[\\"%cINFO%c\\\\n%cinfo输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
    const idx5 = globalIdx;
    logger2.test('test 输出');
    expect(stringify(logBeforeInfo[idx5])).toMatchInlineSnapshot(`""{\\"kind\\":\\"test\\",\\"messages\\":[\\"test输出\\"],\\"logConf\\":{\\"kind\\":\\"test\\",\\"inherit\\":\\"debug\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#eb2f96\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#eb2f96\\"}}""`);
    expect(stringify(outputMessage[idx5])).toMatchInlineSnapshot(`""[\\"%cTEST%c\\\\n%ctest输出\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;\\"]""`);
  });

  it('不输出配置', () => {
    const logger = createLogger({
      noOutput: true,
      ...outputLoggerConfig,
    });
    const idx = globalIdx;
    logger.info('info 输出');
    expect(stringify(logBeforeInfo[idx])).toMatchInlineSnapshot(`""{\\"kind\\":\\"info\\",\\"messages\\":[\\"info输出\\"],\\"logConf\\":{\\"kind\\":\\"info\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#eb2f96\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#eb2f96\\",\\"inherit\\":\\"debug\\"}}""`);
    expect(stringify(outputMessage[idx])).toMatchInlineSnapshot(`""`);
  });

  it('换行输出测试', () => {
    const idx = globalIdx;
    logger.info('换行\n输出\n测试');
    expect(stringify(logBeforeInfo[idx])).toMatchInlineSnapshot(`""{\\"kind\\":\\"info\\",\\"messages\\":[\\"换行\\\\n输出\\\\n测试\\"],\\"logConf\\":{\\"kind\\":\\"info\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#eb2f96\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#eb2f96\\",\\"inherit\\":\\"debug\\"}}""`);
    expect(stringify(outputMessage[idx])).toMatchInlineSnapshot(`""[\\"%cINFO%c\\\\n%c换行%c\\\\n%c输出%c\\\\n%c测试\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-radius:00.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-top-right-radius:0;\\"]""`);
  });

  it('多类型数据输出测试', () => {
    const idx = globalIdx;
    logger.info('字符串', {
      array: [123],
      number: 123,
      map: new Map<any, any>([[{ name: 'objectKey' }, []], [123, ''], [Symbol('key'), {}]]),
      set: new Set([1, '2', Symbol('3'), [], {}]),
      [Symbol('symbol')]: '字符串',
    }, Symbol('symbol'), [1, 2, 3, { a: 1, b: 2 }]);
    expect(stringify(logBeforeInfo[idx])).toMatchInlineSnapshot(`""{\\"kind\\":\\"info\\",\\"messages\\":[\\"字符串\\",{\\"array\\":[123],\\"number\\":123,\\"map\\":{},\\"set\\":{}},null,[1,2,3,{\\"a\\":1,\\"b\\":2}]],\\"logConf\\":{\\"kind\\":\\"info\\",\\"tagColor\\":\\"#fff\\",\\"tagBg\\":\\"#eb2f96\\",\\"contentColor\\":\\"#000\\",\\"contentBg\\":\\"#fff\\",\\"borderColor\\":\\"#eb2f96\\",\\"inherit\\":\\"debug\\"}}""`);
    expect(stringify(outputMessage[idx])).toMatchInlineSnapshot(`""[\\"%cINFO%c\\\\n%c字符串{%c\\\\n%c\\\\\\"array\\\\\\":[%c\\\\n%c123%c\\\\n%c],%c\\\\n%c\\\\\\"number\\\\\\":123,%c\\\\n%c\\\\\\"map\\\\\\":{},%c\\\\n%c\\\\\\"set\\\\\\":{}%c\\\\n%c}Symbol(symbol)[%c\\\\n%c1,%c\\\\n%c2,%c\\\\n%c3,%c\\\\n%c{%c\\\\n%c\\\\\\"a\\\\\\":1,%c\\\\n%c\\\\\\"b\\\\\\":2%c\\\\n%c}%c\\\\n%c]\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;color:#fff;background:#eb2f96;border-radius:0.4rem0.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-radius:00.4rem00;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-radius:0;\\",\\"line-height:1.5;\\",\\"line-height:1.5;padding:0.1rem0.4rem;border:0.1remsolid#eb2f96;margin-top:-0.12rem;color:#000;background:#fff;border-radius:00.4rem0.4rem;border-top:none;border-top-right-radius:0;\\"]""`);
  });

  // expect(stringIfy(logBeforeInfo)).toMatchInlineSnapshot();
  // expect(stringIfy(outputMessage)).toMatchInlineSnapshot();
});
