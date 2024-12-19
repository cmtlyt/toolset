"use strict";(self.webpackChunk_cmtlyt_toolset=self.webpackChunk_cmtlyt_toolset||[]).push([["5155"],{8675:function(e,n,d){d.r(n),d.d(n,{default:function(){return l}});var r=d(2676),s=d(453),t=d(2287);function i(e){let n=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",h3:"h3",table:"table",thead:"thead",tr:"tr",th:"th",tbody:"tbody",td:"td",details:"details",summary:"summary",div:"div",pre:"pre",code:"code",h4:"h4"},(0,s.ah)(),e.components);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(n.h1,{id:"上传管理器",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#上传管理器",children:"#"}),"上传管理器"]}),"\n",(0,r.jsx)(t.Z,{defaultLocale:"zh-CN"}),"\n",(0,r.jsxs)(n.h2,{id:"createuploader---function",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#createuploader---function",children:"#"}),"createUploader - (function)"]}),"\n",(0,r.jsx)(n.p,{children:"创建一个上传管理器, 支持并发上传, 可以调整并发的类型, 例如按分片并发, 或者按文件并发, 自动管理上传状态, 并且返回上传进度信息, 内部使用 fetch 实现文件上传, 可自行传递 headers 和 fetch 的配置, 并且支持通过函数自定义请求体"}),"\n",(0,r.jsxs)(n.h3,{id:"参数",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#参数",children:"#"}),"参数"]}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{align:"center",children:"必填"}),(0,r.jsx)(n.th,{children:"参数名"}),(0,r.jsx)(n.th,{children:"说明"}),(0,r.jsx)(n.th,{children:"类型"}),(0,r.jsx)(n.th,{children:"默认值"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center",children:"*"}),(0,r.jsx)(n.td,{children:"options"}),(0,r.jsx)(n.td,{children:"uploader 配置"}),(0,r.jsx)(n.td,{children:"string"}),(0,r.jsx)(n.td,{})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center",children:"*"}),(0,r.jsx)(n.td,{children:"options.url"}),(0,r.jsx)(n.td,{children:"上传地址"}),(0,r.jsx)(n.td,{children:"string"}),(0,r.jsx)(n.td,{})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.maxConcurrent"}),(0,r.jsx)(n.td,{children:"最大并发数"}),(0,r.jsx)(n.td,{children:"number"}),(0,r.jsx)(n.td,{children:"3"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.concurrentNode"}),(0,r.jsx)(n.td,{children:"并发节点类型"}),(0,r.jsx)(n.td,{children:"'file'|'chunk'"}),(0,r.jsx)(n.td,{children:"'chunk'"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.chunkSize"}),(0,r.jsx)(n.td,{children:"分片大小"}),(0,r.jsx)(n.td,{children:"number"}),(0,r.jsx)(n.td,{children:"1024 * 1024"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.dataType"}),(0,r.jsx)(n.td,{children:"数据类型"}),(0,r.jsx)(n.td,{children:"'FormData'|'binary'"}),(0,r.jsx)(n.td,{children:"'FormData'"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.dataKey"}),(0,r.jsx)(n.td,{children:"数据 key"}),(0,r.jsx)(n.td,{children:"string"}),(0,r.jsx)(n.td,{children:"'file'"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.responseType"}),(0,r.jsx)(n.td,{children:"响应类型"}),(0,r.jsx)(n.td,{children:"'json'"}),(0,r.jsx)(n.td,{children:"'json'"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.retryCount"}),(0,r.jsx)(n.td,{children:"重试次数"}),(0,r.jsx)(n.td,{children:"number"}),(0,r.jsx)(n.td,{children:"3"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.requestMethod"}),(0,r.jsx)(n.td,{children:"请求方法"}),(0,r.jsx)(n.td,{children:"'POST'"}),(0,r.jsx)(n.td,{children:"'POST'"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.headers"}),(0,r.jsx)(n.td,{children:"请求头"}),(0,r.jsx)(n.td,{children:"Record<string, string>"}),(0,r.jsx)(n.td,{children:"{}"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.bodyHandler"}),(0,r.jsx)(n.td,{children:"自定义请求体"}),(0,r.jsx)(n.td,{children:"TBodyHanderFunc"}),(0,r.jsx)(n.td,{children:"-"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.headersHandler"}),(0,r.jsx)(n.td,{children:"自定义请求体"}),(0,r.jsx)(n.td,{children:"THeadersHandler"}),(0,r.jsx)(n.td,{children:"-"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"options.bodyHandler"}),(0,r.jsx)(n.td,{children:"自定义请求体"}),(0,r.jsx)(n.td,{children:"TBodyHanderFunc"}),(0,r.jsx)(n.td,{children:"-"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{align:"center"}),(0,r.jsx)(n.td,{children:"forceCreate"}),(0,r.jsx)(n.td,{children:"强制创建实例"}),(0,r.jsx)(n.td,{children:"boolean"}),(0,r.jsx)(n.td,{children:"false"})]})]})]}),"\n",(0,r.jsxs)(n.details,{className:"rspress-directive details",children:[(0,r.jsx)(n.summary,{className:"rspress-directive-title",children:"类型补充"}),(0,r.jsx)(n.div,{className:"rspress-directive-content",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"type TBodyHanderFunc = (body: { chunk: Blob; chunkIdx: number; customOption: any }) => Record<string, any>;\ntype THeadersHandler = (body: {\n  chunkIdx: number;\n  currentHeanders: Record<string, any>;\n  customOption: any;\n}) => Record<string, any> | Promise<Record<string, any>>;\n"})})})]}),"\n",(0,r.jsxs)(n.div,{className:"rspress-directive danger",children:[(0,r.jsx)(n.div,{className:"rspress-directive-title",children:"警告"}),(0,r.jsx)(n.div,{className:"rspress-directive-content",children:(0,r.jsxs)(n.p,{children:["\n",(0,r.jsx)(n.code,{children:"TBodyHanderFunc"})," 禁止使用闭包\n",(0,r.jsx)(n.code,{children:"THeadersHanderFunc"}),"禁止使用闭包"]})})]}),"\n",(0,r.jsxs)(n.h3,{id:"返回值",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#返回值",children:"#"}),"返回值"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"UploadController"})," 实例"]}),"\n",(0,r.jsxs)(n.h4,{id:"实例类型声明",children:[(0,r.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#实例类型声明",children:"#"}),"实例类型声明"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",meta:"",children:"type TFileLive = File | Blob | string;\ninterface IUploadOptions {\n  onProgress?: (progressInfo: IProgressInfo) => void;\n  customOption?: any;\n}\ninterface IUploadResult {\n  taskInfo: IUploadFinishInfo;\n  customOption: any;\n}\ninterface IUploadFinishInfo {\n  status: 'finished';\n  message: string;\n  chunks: number[];\n  errorChunks: number[];\n}\n\ninterface UploadController {\n  // 上传\n  upload(file: TFileLive, options?: IUploadOptions): Promise<IUploadResult>;\n  // 重试\n  retry(file: TFileLive, chunkIdxs?: number[], options?: IUploadOptions): Promise<IUploadResult>;\n  // 取消\n  abort(file: TFileLive): void;\n  // 清空\n  clear(): void;\n  // 关闭\n  close(): void;\n}\n"})})]})}function c(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,r.jsx)(n,Object.assign({},e,{children:(0,r.jsx)(i,e)})):i(e)}let l=c;c.__RSPRESS_PAGE_META={},c.__RSPRESS_PAGE_META["packages%2Fbase%2Ftools%2FcreateUploader.md"]={toc:[{id:"createuploader---function",text:"createUploader - (function)",depth:2},{id:"参数",text:"参数",depth:3},{id:"返回值",text:"返回值",depth:3},{id:"实例类型声明",text:"实例类型声明",depth:4}],title:"上传管理器",frontmatter:{}}},2287:function(e,n,d){d.d(n,{Z:function(){return l}});var r=d(2676),s=d(5271),t=d(2117);d(4986);let i={"zh-CN":e=>`预计阅读时间: ${e.minutes>=1?`${Math.ceil(e.minutes)} 分钟`:"小于 1 分钟"}`,"en-US":e=>`Estimated reading time: ${e.minutes>=1?`${Math.ceil(e.minutes)} minutes`:"less than 1 minute"}`};function c(e,n,d){let r=Object.keys(i).includes(n)?n:d;return i[r](e)}let l=e=>{let{defaultLocale:n="en-US"}=e,d=(0,t.Vi)().page.readingTimeData,i=(0,t.Jr)(),l=(0,t.e7)(),[a,h]=(0,s.useState)(c(d,i,n));return(0,s.useEffect)(()=>{h(c(d,i,n))},[i,d]),(0,r.jsx)("span",{"data-dark":String(l),className:"rp-reading-time",children:a})}}}]);