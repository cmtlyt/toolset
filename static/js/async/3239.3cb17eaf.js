"use strict";(self.webpackChunk_cmtlyt_document=self.webpackChunk_cmtlyt_document||[]).push([["3239"],{470:function(n,e,t){t.r(e);var r=t(1549),i=t(6603),l=t(9603);function s(n){let e=Object.assign({h1:"h1",a:"a",details:"details",summary:"summary",div:"div",pre:"pre",code:"code",h2:"h2",p:"p",blockquote:"blockquote",strong:"strong",table:"table",thead:"thead",tr:"tr",th:"th",tbody:"tbody",td:"td"},(0,i.ah)(),n.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(e.h1,{id:"cmtlytlogger",children:[(0,r.jsx)(e.a,{className:"header-anchor","aria-hidden":"true",href:"#cmtlytlogger",children:"#"}),"@cmtlyt/logger"]}),"\n",(0,r.jsx)(l.Z,{defaultLocale:"zh-CN"}),"\n","\n",(0,r.jsxs)(e.details,{className:"rspress-directive details",children:[(0,r.jsx)(e.summary,{className:"rspress-directive-title",children:"\u7C7B\u578B\u8865\u5145"}),(0,r.jsx)(e.div,{className:"rspress-directive-content",children:(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-ts",meta:"",children:"interface LogEvent<T extends string = ''> {\n  kind: Kind | T;\n  messages: unknown[];\n  logConf: LoggerConfig<T>;\n  preventDefault: () => void;\n}\n\ninterface StyleConfig {\n  tagColor?: string;\n  tagBg?: string;\n  contentColor?: string;\n  contentBg?: string;\n  borderColor?: string;\n  style?: (config: LoggerConfig) => {\n    tagStyle: string;\n    contentStyle: string;\n  };\n}\n\ninterface LoggerConfig<T extends string = ''> extends StyleConfig {\n  kind: Kind | T;\n  inherit?: Kind | T;\n  noOutput?: boolean;\n  needTrace?: boolean;\n}\n\ntype LoggerConfigObj = Record<Kind, LoggerConfig>;\n\ntype LoggerOptions<T extends string = '', E = unknown> = {\n  needTrace?: boolean;\n  noOutput?: boolean;\n  logConfig?: Partial<LoggerConfigObj> & { [key in T]: LoggerConfig<T> };\n  printFunc?: ((...args: unknown[]) => void) | null;\n  getPrintFunc?: (this: LoggerOptions<T, E>, kind: Kind | T) => ((...args: unknown[]) => void) | null;\n  onLogBefore?: (this: LoggerOptions<T, E>, event: LogEvent<T>) => void;\n} & E;\n\nexport type Kind = 'info' | 'warn' | 'error' | 'debug' | 'success';\n\nexport type Logger = Record<Kind, (...args: unknown[]) => void>;\n"})})})]}),"\n",(0,r.jsxs)(e.h2,{id:"logger",children:[(0,r.jsx)(e.a,{className:"header-anchor","aria-hidden":"true",href:"#logger",children:"#"}),"logger"]}),"\n",(0,r.jsx)(e.p,{children:"\u9ED8\u8BA4 logger \u5B9E\u4F8B"}),"\n",(0,r.jsxs)(e.blockquote,{children:["\n",(0,r.jsx)(e.p,{children:"\u53EA\u6709\u65E5\u5FD7\u8F93\u51FA\u7684\u6837\u5F0F"}),"\n"]}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-ts",meta:"",children:"const logger: Logger & Record<string, (...args: unknown[]) => void>;\n"})}),"\n",(0,r.jsxs)(e.h2,{id:"createlogger",children:[(0,r.jsx)(e.a,{className:"header-anchor","aria-hidden":"true",href:"#createlogger",children:"#"}),"createLogger"]}),"\n",(0,r.jsx)(e.p,{children:"\u521B\u5EFA\u4E00\u4E2A logger \u5B9E\u4F8B"}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:"\u7C7B\u578B\u58F0\u660E"})}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-ts",meta:"",children:"function createLogger<T extends string, E = unknown>(\n  options?: LoggerOptions<T, E>,\n): Logger & Record<T, (...args: unknown[]) => void>;\n"})}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:"\u53C2\u6570"})}),"\n",(0,r.jsxs)(e.table,{children:[(0,r.jsx)(e.thead,{children:(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.th,{align:"center",children:"\u5FC5\u586B"}),(0,r.jsx)(e.th,{align:"left",children:"\u53C2\u6570"}),(0,r.jsx)(e.th,{align:"left",children:"\u8BF4\u660E"}),(0,r.jsx)(e.th,{align:"left",children:"\u7C7B\u578B"}),(0,r.jsx)(e.th,{align:"left",children:"\u9ED8\u8BA4\u503C"})]})}),(0,r.jsxs)(e.tbody,{children:[(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.td,{align:"center"}),(0,r.jsx)(e.td,{align:"left",children:"options"}),(0,r.jsx)(e.td,{align:"left",children:"logger \u914D\u7F6E"}),(0,r.jsx)(e.td,{align:"left",children:"LoggerOptions<T, E>"}),(0,r.jsx)(e.td,{align:"left",children:"-"})]}),(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.td,{align:"center"}),(0,r.jsx)(e.td,{align:"left",children:"options.needTrace"}),(0,r.jsx)(e.td,{align:"left",children:"\u662F\u5426\u9700\u8981\u6253\u5370\u8C03\u7528\u6808"}),(0,r.jsx)(e.td,{align:"left",children:"boolean"}),(0,r.jsx)(e.td,{align:"left",children:"false"})]}),(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.td,{align:"center"}),(0,r.jsx)(e.td,{align:"left",children:"options.noOutput"}),(0,r.jsx)(e.td,{align:"left",children:"\u662F\u5426\u9700\u8981\u8F93\u51FA\u65E5\u5FD7"}),(0,r.jsx)(e.td,{align:"left",children:"boolean"}),(0,r.jsx)(e.td,{align:"left",children:"false"})]}),(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.td,{align:"center"}),(0,r.jsx)(e.td,{align:"left",children:"options.logConfig"}),(0,r.jsx)(e.td,{align:"left",children:"logger \u914D\u7F6E"}),(0,r.jsx)(e.td,{align:"left",children:"Partial<LoggerConfigObj> & { [key in T]: LoggerConfig<T> }"}),(0,r.jsx)(e.td,{align:"left",children:"-"})]}),(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.td,{align:"center"}),(0,r.jsx)(e.td,{align:"left",children:"options.printFunc"}),(0,r.jsx)(e.td,{align:"left",children:"\u6253\u5370\u65E5\u5FD7\u7684\u51FD\u6570"}),(0,r.jsx)(e.td,{align:"left",children:"((...args: unknown[]) => void)"}),(0,r.jsx)(e.td,{align:"left",children:"console.log"})]}),(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.td,{align:"center"}),(0,r.jsx)(e.td,{align:"left",children:"options.getPrintFunc"}),(0,r.jsxs)(e.td,{align:"left",children:["\u83B7\u53D6\u6253\u5370\u65E5\u5FD7\u7684\u51FD\u6570 (\u4F18\u5148\u7EA7\u4F4E\u4E8E ",(0,r.jsx)(e.code,{children:"printFunc"}),")"]}),(0,r.jsx)(e.td,{align:"left",children:"(this: LoggerOptions<T, E>, kind: Kind | T) => ((...args: unknown[]) => void)"}),(0,r.jsx)(e.td,{align:"left",children:"-"})]}),(0,r.jsxs)(e.tr,{children:[(0,r.jsx)(e.td,{align:"center"}),(0,r.jsx)(e.td,{align:"left",children:"options.onLogBefore"}),(0,r.jsx)(e.td,{align:"left",children:"\u65E5\u5FD7\u6253\u5370\u524D\u56DE\u8C03"}),(0,r.jsx)(e.td,{align:"left",children:"(this: LoggerOptions<T, E>, event: LogEvent<T>) => void"}),(0,r.jsx)(e.td,{align:"left",children:"-"})]})]})]}),"\n",(0,r.jsxs)(e.p,{children:[(0,r.jsx)(e.strong,{children:"\u8FD4\u56DE\u503C:"})," ",(0,r.jsx)(e.code,{children:"Logger & Record<T, (...args: unknown[]) => void>"})]}),"\n",(0,r.jsx)(e.p,{children:(0,r.jsx)(e.strong,{children:"\u5B9E\u4F8B"})}),"\n",(0,r.jsx)(e.pre,{children:(0,r.jsx)(e.code,{className:"language-ts",meta:"",children:"type ExtendKind = 'click' | 'appear' | 'todo' | 'event' | 'expose';\ntype AllKind = Kind | ExtendKind;\n\ninterface LoggerExtendOptions {\n  store: {\n    needExposeKind: AllKind[];\n  };\n}\n\nconst isProd = process.env.NODE_ENV === 'production';\n\nconst logger = createLogger<ExtendKind, LoggerExtendOptions>({\n  // \u975E\u751F\u4EA7\u73AF\u5883\u4E0B\u9700\u8981\u6253\u5370\u8C03\u7528\u6808\n  needTrace: !isProd,\n  // \u751F\u4EA7\u73AF\u5883\u4E0B\u4E0D\u5728\u63A7\u5236\u53F0\u8F93\u51FA\n  noOutput: isProd,\n  // \u81EA\u5B9A\u4E49 logger \u65B9\u6CD5\u914D\u7F6E\n  logConfig: {\n    // logger.click \u65B9\u6CD5\u6837\u5F0F\u7EE7\u627F\u81EA logger.info\n    click: { kind: 'click', inherit: 'info' },\n    appear: { kind: 'appear', inherit: 'info', needTrace: false },\n    error: { kind: 'error', needTrace: true },\n  },\n  // \u901A\u8FC7 LoggerExtendsOptions \u6269\u5C55\u7684\u914D\u7F6E\u9879\n  store: {\n    needExposeKind: ['click', 'appear', 'error'],\n  },\n  // \u751F\u4EA7\u73AF\u5883\u4E0B\u4E0D\u5728\u63A7\u5236\u53F0\u8F93\u51FA (\u4E0D\u63A8\u8350\u4F7F\u7528\u8BE5\u65B9\u6CD5\u963B\u6B62\u65E5\u5FD7\u8F93\u51FA, \u5982\u679C\u4E00\u5B9A\u8981\u7684\u8BDD\u53EF\u4EE5\u4F7F\u7528 `noOutput`)\n  // \u8FD4\u56DE null \u7684\u8BDD\u5219\u5C06\u8F93\u51FA\u65B9\u6CD5\u8F6C\u4EA4 `getPrintFunc` \u63A7\u5236\n  printFunc: isProd ? () => {} : null,\n  // \u83B7\u53D6\u6253\u5370\u65E5\u5FD7\u7684\u51FD\u6570, \u5982\u679C\u672A\u914D\u7F6E\u5219\u9ED8\u8BA4\u4F7F\u7528 console.log\n  getPrintFunc(kind) {\n    // \u6839\u636E\u4E0D\u540C\u7684 kind \u9009\u62E9\u4E0D\u540C\u7684\u8F93\u51FA\u65B9\u6CD5\n    if (kind === 'click' || kind === 'error') return console.log;\n    return console.debug;\n  },\n  // \u8F93\u51FA\u5230\u63A7\u5236\u53F0\u4E4B\u524D\u8FDB\u884C\u4E00\u4E9B\u5904\u7406\n  onLogBefore(e) {\n    const { needExposeKind } = this.store;\n    if (isProd && needExposeKind.includes(kind)) {\n      // \u963B\u6B62\u65E5\u5FD7\u8F93\u51FA\n      e.preventDefault();\n      // \u65E5\u5FD7\u4E0A\u62A5\u903B\u8F91\n      // ...\n    }\n  },\n});\n"})})]})}function o(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:e}=Object.assign({},(0,i.ah)(),n.components);return e?(0,r.jsx)(e,Object.assign({},n,{children:(0,r.jsx)(s,n)})):s(n)}e.default=o,o.__RSPRESS_PAGE_META={},o.__RSPRESS_PAGE_META["packages%2Flogger%2Findex.md"]={toc:[{id:"logger",text:"logger",depth:2},{id:"createlogger",text:"createLogger",depth:2}],title:"@cmtlyt/logger",frontmatter:{}}},9603:function(n,e,t){t(9369);var r=t(1549),i=t(4194),l=t(8893);t(6562);let s={"zh-CN":n=>`\u{9884}\u{8BA1}\u{9605}\u{8BFB}\u{65F6}\u{95F4}: ${n.minutes>=1?`${Math.ceil(n.minutes)} \u{5206}\u{949F}`:"\u5C0F\u4E8E 1 \u5206\u949F"}`,"en-US":n=>`Estimated reading time: ${n.minutes>=1?`${Math.ceil(n.minutes)} minutes`:"less than 1 minute"}`};function o(n,e,t){let r=Object.keys(s).includes(e)?e:t;return s[r](n)}e.Z=n=>{let{defaultLocale:e="en-US"}=n,t=(0,l.Vi)().page.readingTimeData,s=(0,l.Jr)(),d=(0,l.e7)(),[g,c]=(0,i.useState)(o(t,s,e));return(0,i.useEffect)(()=>{c(o(t,s,e))},[s,t]),(0,r.jsx)("span",{"data-dark":String(d),className:"rp-reading-time",children:g})}}}]);