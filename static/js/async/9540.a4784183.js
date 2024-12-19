"use strict";(self.webpackChunk_cmtlyt_toolset=self.webpackChunk_cmtlyt_toolset||[]).push([["9540"],{8191:function(e,n,s){s.r(n),s.d(n,{default:function(){return l}});var r=s(2676),t=s(453),i=s(2287);function c(e){let n=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",strong:"strong",pre:"pre",code:"code",table:"table",thead:"thead",tr:"tr",th:"th",tbody:"tbody",td:"td"},(0,t.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"数据获取相关方法",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#数据获取相关方法",children:"#"}),"数据获取相关方法"]}),"\n",(0,r.jsx)(i.Z,{defaultLocale:"zh-CN"}),"\n",(0,r.jsxs)(n.h2,{id:"getrandomstring",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getrandomstring",children:"#"}),"getRandomString"]}),"\n",(0,r.jsx)(n.p,{children:"获取指定长度的随机字符串"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"function getRandomString(len?: number): string;\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"参数"})}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{align:"center",children:"必填"}),(0,r.jsx)(n.th,{children:"参数"}),(0,r.jsx)(n.th,{children:"说明"}),(0,r.jsx)(n.th,{children:"类型"}),(0,r.jsx)(n.th,{children:"默认值"})]})}),(0,r.jsx)(n.tbody,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"len"}),(0,r.jsx)(n.td,{children:"字符串长度"}),(0,r.jsx)(n.td,{children:"number"}),(0,r.jsx)(n.td,{children:"8"})]})})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:"string"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",meta:"",children:"import { getRandomString } from '@cmtlyt/base';\n// import { getRandomString } from '@cmtlyt/base/utils/getData'\n\nconst str = getRandomString(10);\nconsole.log(str); // a8sdf9aqw1\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"createlinkbystring",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#createlinkbystring",children:"#"}),"createLinkByString"]}),"\n",(0,r.jsxs)(n.p,{children:["将传入的字符串转化为 ",(0,r.jsx)(n.code,{children:"blob"})," 地址"]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"function createLinkByString(resource: string): string;\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"参数"})}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{align:"center",children:"必填"}),(0,r.jsx)(n.th,{children:"参数"}),(0,r.jsx)(n.th,{children:"说明"}),(0,r.jsx)(n.th,{children:"类型"}),(0,r.jsx)(n.th,{children:"默认值"})]})}),(0,r.jsx)(n.tbody,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center",children:"*"}),(0,r.jsx)(n.td,{children:"resource"}),(0,r.jsx)(n.td,{children:"资源内容"}),(0,r.jsx)(n.td,{children:"string"}),(0,r.jsx)(n.td,{children:"-"})]})})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:"string"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",meta:"",children:"import { createLinkByString } from '@cmtlyt/base';\n// import { createLinkByString } from '@cmtlyt/base/utils/getData'\n\nconst blobUrl = createLinkByString('console.log(\"hello world\")');\nconsole.log(blobUrl); // blob:https://xxxx\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"generatecookieinfo",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#generatecookieinfo",children:"#"}),"generateCookieInfo"]}),"\n",(0,r.jsx)(n.p,{children:"生成 cookie 信息"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"interface ICookieOptions {\n  duration?: number;\n  expires?: string | Date;\n  domain?: string;\n  maxAge?: number;\n  path?: string;\n}\n\nfunction generateCookieInfo(options: ICookieOptions): string;\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"参数"})}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{align:"center",children:"必填"}),(0,r.jsx)(n.th,{children:"参数"}),(0,r.jsx)(n.th,{children:"说明"}),(0,r.jsx)(n.th,{children:"类型"}),(0,r.jsx)(n.th,{children:"默认值"})]})}),(0,r.jsx)(n.tbody,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options"}),(0,r.jsx)(n.td,{children:"cookie 配置"}),(0,r.jsx)(n.td,{children:"ICookieOptions"}),(0,r.jsx)(n.td,{children:"{}"})]})})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:"string"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",meta:"",children:"import { generateCookieInfo } from '@cmtlyt/base';\n// import { generateCookieInfo } from '@cmtlyt/base/utils/getData'\n\nconst cookieInfo = generateCookieInfo({\n  duration: 10,\n  expires: '2023-12-25',\n  domain: 'example.com',\n  maxAge: 10,\n  path: '/',\n});\nconsole.log(cookieInfo); // \"expires=Fri, 25 Dec 2023 00:00:00 GMT;domain=example.com;max-age=10;path=/\"\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"generateclassname",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#generateclassname",children:"#"}),"generateClassName"]}),"\n",(0,r.jsx)(n.p,{children:"生成 className"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"function generateClassName(\n  ...args: (string | string[] | Record<string, boolean>|Record<string, boolean>[](string|Record<string, boolean>)[])[]\n): string;\n\nconst gc: typeof generateClassName;\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"参数"})}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{align:"center",children:"必填"}),(0,r.jsx)(n.th,{children:"参数"}),(0,r.jsx)(n.th,{children:"说明"}),(0,r.jsx)(n.th,{children:"类型"}),(0,r.jsx)(n.th,{children:"默认值"})]})}),(0,r.jsx)(n.tbody,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center",children:"*"}),(0,r.jsx)(n.td,{children:"args"}),(0,r.jsx)(n.td,{children:"类名"}),(0,r.jsx)(n.td,{children:"(string|string[]|Record<string, boolean>|Record<string, boolean>[]|(string|Record<string, boolean>)[])[]"}),(0,r.jsx)(n.td,{children:"-"})]})})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:"string"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",meta:"",children:"import { generateClassName, gc } from '@cmtlyt/base';\n// import { generateClassName, gc } from '@cmtlyt/base/utils/getData'\n\nconst className = generateClassName('a', 'b', { c: true }, ['d', { e: false, f: true }]);\nconst className2 = gc('a', 'b', { c: true }, ['d', { e: false, f: true }]);\nconsole.log('className:', className); // className: \"a b c d f\"\nconsole.log('className2:', className2); // className2: \"a b c d f\"\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"getnow",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getnow",children:"#"}),"getNow"]}),"\n",(0,r.jsxs)(n.p,{children:["获取当前时间, 支持 ",(0,r.jsx)(n.code,{children:"performance API"})," 的浏览器会返回 ",(0,r.jsx)(n.code,{children:"performance.now"}),", 不支持的浏览器会返回 ",(0,r.jsx)(n.code,{children:"Date.now"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"getNow(): number\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:"number"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"import { getNow } from '@cmtlyt/base';\n// import { getNow } from '@cmtlyt/base/utils/getData';\n\ngetNow(); // 1692889934\ngetNow(); // 1692889935\ngetNow(); // 1692889936\ngetNow(); // 1692889937\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"getostype",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getostype",children:"#"}),"getOsType"]}),"\n",(0,r.jsx)(n.p,{children:"获取操作系统类型"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"function getOsType():\n  | 'ios'\n  | 'android'\n  | 'openHarmony'\n  | 'mac'\n  | 'windows'\n  | 'linux'\n  | 'aix'\n  | 'freebsd'\n  | 'haiku'\n  | 'openbsd'\n  | 'sunos'\n  | 'cygwin'\n  | 'netbsd'\n  | 'other';\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:'"ios" | "android" | "openHarmony" | "mac" | "windows" | "linux" | "aix" | "freebsd" | "haiku" | "openbsd" | "sunos" | "cygwin" | "netbsd" | "other"'})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"import { getOsType } from '@cmtlyt/base';\n// import { getOsType } from '@cmtlyt/base/utils/getData';\ngetOsType(); // ios\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"getuseragent",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getuseragent",children:"#"}),"getUserAgent"]}),"\n",(0,r.jsx)(n.p,{children:"获取用户代理"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"function getUserAgent(): string;\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:"string"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"import { getUserAgent } from '@cmtlyt/base';\n// import { getUserAgent } from '@cmtlyt/base/utils/getData';\n\ngetUserAgent(); // \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36\"\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"getdeviceinfo",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#getdeviceinfo",children:"#"}),"getDeviceInfo"]}),"\n",(0,r.jsx)(n.p,{children:"获取设备信息"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"function getDeviceInfo(): {\n  appName: string;\n  appVersion: string;\n  screenWidth: number;\n  screenHeight: number;\n  devicePixelRatio: number;\n  platform: string;\n  userAgent: string;\n};\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:"{ appName: string; appVersion: string; screenWidth: number; screenHeight: number; devicePixelRatio: number; platform: string; userAgent: string; }"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:'import { getDeviceInfo } from \'@cmtlyt/base\';\n// import { getDeviceInfo } from \'@cmtlyt/base/utils/getData\';\n\ngetDeviceInfo(); // { appName: "Chrome", appVersion: "120.0.0.0", screenWidth: 1440, screenHeight: 900, devicePixelRatio: 2, platform: "macOS", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.\n'})}),"\n",(0,r.jsxs)(n.h2,{id:"safegetglobal",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#safegetglobal",children:"#"}),"safeGetGlobal"]}),"\n",(0,r.jsx)(n.p,{children:"安全获取全局变量"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"function safeGetGlobal(): any;\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:"any"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"import { safeGetGlobal } from '@cmtlyt/base';\n// import { safeGetGlobal } from '@cmtlyt/base/utils/getData';\n\n// 浏览器\nsafeGetGlobal(); // window\n// node\nsafeGetGlobal(); // global\n// 小程序\nsafeGetGlobal(); // my\n"})}),"\n",(0,r.jsxs)(n.h2,{id:"gettype",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#gettype",children:"#"}),"getType"]}),"\n",(0,r.jsx)(n.p,{children:"获取值类型"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"类型声明"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"function getType(value: any): string;\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"参数"})}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{align:"center",children:"必填"}),(0,r.jsx)(n.th,{children:"参数名"}),(0,r.jsx)(n.th,{children:"类型"}),(0,r.jsx)(n.th,{children:"描述"}),(0,r.jsx)(n.th,{children:"默认值"})]})}),(0,r.jsx)(n.tbody,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center",children:"*"}),(0,r.jsx)(n.td,{children:"value"}),(0,r.jsx)(n.td,{children:"any"}),(0,r.jsx)(n.td,{children:"待判断的值"}),(0,r.jsx)(n.td,{children:"-"})]})})]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"返回值"}),": ",(0,r.jsx)(n.code,{children:"string"})]}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"示例"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"import { getType } from '@cmtlyt/base';\n// import { getType } from '@cmtlyt/base/utils/getData';\n\ngetType(NaN); // 'number'\ngetType(undefined); // 'undefined'\ngetType(0); // 'number'\ngetType(''); // 'string'\ngetType([]); // 'array'\ngetType({}); // 'object'\ngetType(() => {}); // 'function'\ngetType(Promise.resolve()); // 'promise'\ngetType({ then() {} }); // 'object'\n"})})]})}function a(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,t.ah)(),e.components);return n?(0,r.jsx)(n,Object.assign({},e,{children:(0,r.jsx)(c,e)})):c(e)}let l=a;a.__RSPRESS_PAGE_META={},a.__RSPRESS_PAGE_META["packages%2Fbase%2Futils%2FgetData.md"]={toc:[{id:"getrandomstring",text:"getRandomString",depth:2},{id:"createlinkbystring",text:"createLinkByString",depth:2},{id:"generatecookieinfo",text:"generateCookieInfo",depth:2},{id:"generateclassname",text:"generateClassName",depth:2},{id:"getnow",text:"getNow",depth:2},{id:"getostype",text:"getOsType",depth:2},{id:"getuseragent",text:"getUserAgent",depth:2},{id:"getdeviceinfo",text:"getDeviceInfo",depth:2},{id:"safegetglobal",text:"safeGetGlobal",depth:2},{id:"gettype",text:"getType",depth:2}],title:"数据获取相关方法",frontmatter:{}}},2287:function(e,n,s){s.d(n,{Z:function(){return l}});var r=s(2676),t=s(5271),i=s(2117);s(4986);let c={"zh-CN":e=>`预计阅读时间: ${e.minutes>=1?`${Math.ceil(e.minutes)} 分钟`:"小于 1 分钟"}`,"en-US":e=>`Estimated reading time: ${e.minutes>=1?`${Math.ceil(e.minutes)} minutes`:"less than 1 minute"}`};function a(e,n,s){let r=Object.keys(c).includes(n)?n:s;return c[r](e)}let l=e=>{let{defaultLocale:n="en-US"}=e,s=(0,i.Vi)().page.readingTimeData,c=(0,i.Jr)(),l=(0,i.e7)(),[d,h]=(0,t.useState)(a(s,c,n));return(0,t.useEffect)(()=>{h(a(s,c,n))},[c,s]),(0,r.jsx)("span",{"data-dark":String(l),className:"rp-reading-time",children:d})}}}]);