"use strict";(self.webpackChunk_cmtlyt_toolset=self.webpackChunk_cmtlyt_toolset||[]).push([["2799"],{4580:function(t,e,n){n.r(e),n.d(e,{default:function(){return r}});var i=n(2676),a=n(453),l=n(2287);function s(t){return(0,i.jsx)(l.Z,{defaultLocale:"zh-CN"})}function c(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:e}=Object.assign({},(0,a.ah)(),t.components);return e?(0,i.jsx)(e,Object.assign({},t,{children:(0,i.jsx)(s,t)})):s(t)}let r=c;c.__RSPRESS_PAGE_META={},c.__RSPRESS_PAGE_META["index.md"]={toc:[],title:"@cmtlyt 文档",frontmatter:{title:"@cmtlyt 文档",description:"这是 @cmtlyt 的文档",titleSuffix:"| 开发的基本工具",pageType:"home",hero:{name:"@cmtlyt 文档",text:"包含开发的基本工具",tagline:"个人开发, 大家有想法的可以提一下, 作者很好说话!!!",image:{src:"/utils-rabbit.png",alt:"logo"},actions:[{theme:"brand",text:"快速开始",link:"/guides/index"},{theme:"alt",text:"前往仓库",link:"https://github.com/cmtlyt/base"}]}}}},2287:function(t,e,n){n.d(e,{Z:function(){return r}});var i=n(2676),a=n(5271),l=n(2117);n(4986);let s={"zh-CN":t=>`预计阅读时间: ${t.minutes>=1?`${Math.ceil(t.minutes)} 分钟`:"小于 1 分钟"}`,"en-US":t=>`Estimated reading time: ${t.minutes>=1?`${Math.ceil(t.minutes)} minutes`:"less than 1 minute"}`};function c(t,e,n){let i=Object.keys(s).includes(e)?e:n;return s[i](t)}let r=t=>{let{defaultLocale:e="en-US"}=t,n=(0,l.Vi)().page.readingTimeData,s=(0,l.Jr)(),r=(0,l.e7)(),[u,m]=(0,a.useState)(c(n,s,e));return(0,a.useEffect)(()=>{m(c(n,s,e))},[s,n]),(0,i.jsx)("span",{"data-dark":String(r),className:"rp-reading-time",children:u})}}}]);