"use strict";(self.webpackChunk_cmtlyt_toolset=self.webpackChunk_cmtlyt_toolset||[]).push([["657"],{9745:function(e,n,t){t.r(n),t.d(n,{default:function(){return l}});var i=t(2676),a=t(453),r=t(2287);function s(e){let n=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",h3:"h3",ol:"ol",li:"li"},(0,a.ah)(),e.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.h1,{id:"执行栈和执行上下文",children:[(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#执行栈和执行上下文",children:"#"}),"执行栈和执行上下文"]}),"\n",(0,i.jsx)(r.Z,{defaultLocale:"zh-CN"}),"\n",(0,i.jsxs)(n.h2,{id:"执行上下文",children:[(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#执行上下文",children:"#"}),"执行上下文"]}),"\n",(0,i.jsx)(n.p,{children:"执行上下文(Execution Context),一句话概括就是“代码(全局代码,函数代码)执行前进行的准备工作”,也成为“执行上下文环境”"}),"\n",(0,i.jsx)(n.p,{children:"直行JavaScript代码时,但代码执行进入一个环境时,就会为该环境创建一个执行上下文,他会在你运行代码强作一些准备工作,如确定作用域,创建局部变量对象"}),"\n",(0,i.jsx)(n.p,{children:"具体做了什么我们慢慢来看,先来看下JavaScript执行环境有哪些"}),"\n",(0,i.jsxs)(n.h3,{id:"javascript中执行环境",children:[(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#javascript中执行环境",children:"#"}),"JavaScript中执行环境"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"全局环境"}),"\n",(0,i.jsx)(n.li,{children:"函数环境"}),"\n",(0,i.jsx)(n.li,{children:"eval函数环境(已不推荐使用)"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"那么对应的执行上下文类型同样有3种"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"全局执行上下文"}),"\n",(0,i.jsx)(n.li,{children:"函数执行上下文"}),"\n",(0,i.jsx)(n.li,{children:"eval函数执行上下文"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"JavaScript运行时首先会进入全局环境,对应会生成全局上下文  程序代码中基本都会存在函数,那么调用函数就会进入函数执行环境,对应就会生成该函数的执行函数的下文"}),"\n",(0,i.jsx)(n.p,{children:"由于代码中会声明多个函数,对应的函数执行上下文也会存在多个  在JavaScript中,通过栈的存取方式来管理执行上下文,我们可称其为执行栈,或函数调用栈(Call Stack)"})]})}function c(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,a.ah)(),e.components);return n?(0,i.jsx)(n,Object.assign({},e,{children:(0,i.jsx)(s,e)})):s(e)}let l=c;c.__RSPRESS_PAGE_META={},c.__RSPRESS_PAGE_META["wiki%2Fjavascript%2F%E6%89%A7%E8%A1%8C%E6%A0%88%E5%92%8C%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87.md"]={toc:[{id:"执行上下文",text:"执行上下文",depth:2},{id:"javascript中执行环境",text:"JavaScript中执行环境",depth:3}],title:"执行栈和执行上下文",frontmatter:{}}},2287:function(e,n,t){t.d(n,{Z:function(){return l}});var i=t(2676),a=t(5271),r=t(2117);t(4986);let s={"zh-CN":e=>`预计阅读时间: ${e.minutes>=1?`${Math.ceil(e.minutes)} 分钟`:"小于 1 分钟"}`,"en-US":e=>`Estimated reading time: ${e.minutes>=1?`${Math.ceil(e.minutes)} minutes`:"less than 1 minute"}`};function c(e,n,t){let i=Object.keys(s).includes(n)?n:t;return s[i](e)}let l=e=>{let{defaultLocale:n="en-US"}=e,t=(0,r.Vi)().page.readingTimeData,s=(0,r.Jr)(),l=(0,r.e7)(),[h,d]=(0,a.useState)(c(t,s,n));return(0,a.useEffect)(()=>{d(c(t,s,n))},[s,t]),(0,i.jsx)("span",{"data-dark":String(l),className:"rp-reading-time",children:h})}}}]);