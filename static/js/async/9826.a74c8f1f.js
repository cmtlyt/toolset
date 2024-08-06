"use strict";(self.webpackChunk_cmtlyt_document=self.webpackChunk_cmtlyt_document||[]).push([["9826"],{4701:function(e,n,s){s.r(n);var r=s(1549),t=s(6603),l=s(9603);function d(e){let n=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",h3:"h3",pre:"pre",code:"code",table:"table",thead:"thead",tr:"tr",th:"th",tbody:"tbody",td:"td",details:"details",summary:"summary",div:"div",strong:"strong",hr:"hr"},(0,t.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"\u65E5\u5FD7\u7BA1\u7406",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u65E5\u5FD7\u7BA1\u7406",children:"#"}),"\u65E5\u5FD7\u7BA1\u7406"]}),"\n",(0,r.jsx)(l.Z,{defaultLocale:"zh-CN"}),"\n",(0,r.jsxs)(n.h2,{id:"logger---class",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#logger---class",children:"#"}),"Logger - (class)"]}),"\n",(0,r.jsx)(n.p,{children:"\u65E5\u5FD7\u7BA1\u7406\u5668"}),"\n",(0,r.jsxs)(n.h3,{id:"\u9759\u6001\u65B9\u6CD5",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u9759\u6001\u65B9\u6CD5",children:"#"}),"\u9759\u6001\u65B9\u6CD5"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"function getInstance(options: LoggerOptions): Logger;\n"})}),"\n",(0,r.jsxs)(n.h3,{id:"\u53C2\u6570",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u53C2\u6570",children:"#"}),"\u53C2\u6570"]}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{align:"left",children:"\u5FC5\u586B"}),(0,r.jsx)(n.th,{align:"left",children:"\u53C2\u6570\u540D"}),(0,r.jsx)(n.th,{align:"left",children:"\u8BF4\u660E"}),(0,r.jsx)(n.th,{align:"left",children:"\u7C7B\u578B"}),(0,r.jsx)(n.th,{align:"left",children:"\u9ED8\u8BA4\u503C"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"left"}),(0,r.jsx)(n.td,{align:"left",children:"options"}),(0,r.jsx)(n.td,{align:"left",children:"\u65E5\u5FD7\u914D\u7F6E"}),(0,r.jsx)(n.td,{align:"left",children:"object"}),(0,r.jsx)(n.td,{align:"left"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"left"}),(0,r.jsx)(n.td,{align:"left",children:"options.showModuleIds"}),(0,r.jsx)(n.td,{align:"left",children:"\u5C55\u793A\u6A21\u5757 id"}),(0,r.jsx)(n.td,{align:"left",children:"any[]"}),(0,r.jsx)(n.td,{align:"left",children:"[]"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"left"}),(0,r.jsx)(n.td,{align:"left",children:"options.showMethods"}),(0,r.jsx)(n.td,{align:"left",children:"\u5C55\u793A\u65B9\u6CD5"}),(0,r.jsx)(n.td,{align:"left",children:"string[]"}),(0,r.jsx)(n.td,{align:"left",children:"['log', 'info', 'warn', 'error', 'debug']"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"left"}),(0,r.jsx)(n.td,{align:"left",children:"options.ignoreMessage"}),(0,r.jsx)(n.td,{align:"left",children:"\u5FFD\u7565\u7684\u6D88\u606F"}),(0,r.jsx)(n.td,{align:"left",children:"string[]|IgnoreMessageFunc"}),(0,r.jsx)(n.td,{align:"left",children:"[]"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"left"}),(0,r.jsx)(n.td,{align:"left",children:"options.messageTemplate"}),(0,r.jsx)(n.td,{align:"left",children:"\u6D88\u606F\u6A21\u677F"}),(0,r.jsx)(n.td,{align:"left",children:"string|MessageTemplateFunc"}),(0,r.jsx)(n.td,{align:"left",children:(0,r.jsx)(n.code,{children:"#[date] #[moduleId]-#[method]:=>#[message]"})})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"left"}),(0,r.jsx)(n.td,{align:"left",children:"options.controller"}),(0,r.jsx)(n.td,{align:"left",children:"\u65E5\u5FD7\u63A7\u5236\u5668"}),(0,r.jsx)(n.td,{align:"left",children:"Controller"}),(0,r.jsx)(n.td,{align:"left",children:(0,r.jsx)(n.code,{children:"console"})})]})]})]}),"\n",(0,r.jsxs)(n.details,{className:"rspress-directive details",children:[(0,r.jsx)(n.summary,{className:"rspress-directive-title",children:"\u7C7B\u578B\u6269\u5C55"}),(0,r.jsxs)(n.div,{className:"rspress-directive-content",children:[(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"IgnoreMessageFunc"})}),(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u7C7B\u578B\u58F0\u660E"})}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"type IgnoreMessageFunc = (message: string) => boolean;\n"})}),(0,r.jsx)(n.hr,{}),(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"MessageTemplateFunc"})}),(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u7C7B\u578B\u58F0\u660E"})}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"type MessageTemplateFunc = (data: any[], moduleId: ModuleId, method: string, date: Date) => string | any[];\n"})}),(0,r.jsx)(n.hr,{}),(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Controller"})}),(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"options.controller"})," \u5FC5\u987B\u8981\u5B9E\u73B0 ",(0,r.jsx)(n.code,{children:"Controller"})," \u63A5\u53E3"]}),(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"\u7C7B\u578B\u58F0\u660E"})}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"type ControllerFunc = (moduleId: any, ...args: any[]) => void;\r\n\r\ninterface Controller {\r\n  log: ControllerFunc;\r\n  info: ControllerFunc;\r\n  warn: ControllerFunc;\r\n  error: ControllerFunc;\r\n  debug: ControllerFunc;\r\n  onOutput?: (logInfo: LogInfo) => void;\r\n}\n"})})]})]}),"\n",(0,r.jsxs)(n.h3,{id:"\u8FD4\u56DE\u503C",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u8FD4\u56DE\u503C",children:"#"}),"\u8FD4\u56DE\u503C"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"Logger"})," \u5B9E\u4F8B"]}),"\n",(0,r.jsxs)(n.h3,{id:"\u5B9E\u4F8B\u65B9\u6CD5",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u5B9E\u4F8B\u65B9\u6CD5",children:"#"}),"\u5B9E\u4F8B\u65B9\u6CD5"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"interface Logger {\r\n  log(moduleId: any, method: string, ...args: any[]): void;\r\n  info(moduleId: any, method: string, ...args: any[]): void;\r\n  warn(moduleId: any, method: string, ...args: any[]): void;\r\n  error(moduleId: any, method: string, ...args: any[]): void;\r\n  debug(moduleId: any, method: string, ...args: any[]): void;\r\n}\n"})})]})}function i(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,t.ah)(),e.components);return n?(0,r.jsx)(n,Object.assign({},e,{children:(0,r.jsx)(d,e)})):d(e)}n.default=i,i.__RSPRESS_PAGE_META={},i.__RSPRESS_PAGE_META["packages%2Fbase%2Ftools%2Flogger.md"]={toc:[{id:"logger---class",text:"Logger - (class)",depth:2},{id:"\u9759\u6001\u65B9\u6CD5",text:"\u9759\u6001\u65B9\u6CD5",depth:3},{id:"\u53C2\u6570",text:"\u53C2\u6570",depth:3},{id:"\u8FD4\u56DE\u503C",text:"\u8FD4\u56DE\u503C",depth:3},{id:"\u5B9E\u4F8B\u65B9\u6CD5",text:"\u5B9E\u4F8B\u65B9\u6CD5",depth:3}],title:"\u65E5\u5FD7\u7BA1\u7406",frontmatter:{}}},9603:function(e,n,s){s(9369);var r=s(1549),t=s(4194),l=s(8893);s(6562);let d={"zh-CN":e=>`\u{9884}\u{8BA1}\u{9605}\u{8BFB}\u{65F6}\u{95F4}: ${e.minutes>=1?`${Math.ceil(e.minutes)} \u{5206}\u{949F}`:"\u5C0F\u4E8E 1 \u5206\u949F"}`,"en-US":e=>`Estimated reading time: ${e.minutes>=1?`${Math.ceil(e.minutes)} minutes`:"less than 1 minute"}`};function i(e,n,s){let r=Object.keys(d).includes(n)?n:s;return d[r](e)}n.Z=e=>{let{defaultLocale:n="en-US"}=e,s=(0,l.Vi)().page.readingTimeData,d=(0,l.Jr)(),a=(0,l.e7)(),[c,h]=(0,t.useState)(i(s,d,n));return(0,t.useEffect)(()=>{h(i(s,d,n))},[d,s]),(0,r.jsx)("span",{"data-dark":String(a),className:"rp-reading-time",children:c})}}}]);