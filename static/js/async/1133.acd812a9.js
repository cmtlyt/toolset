"use strict";(self.webpackChunk_cmtlyt_toolset=self.webpackChunk_cmtlyt_toolset||[]).push([["1133"],{2332:function(e,n,i){i.r(n),i.d(n,{default:function(){return c}});var t=i(2676),s=i(453),r=i(2287);function l(e){let n=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",ol:"ol",li:"li",ul:"ul"},(0,s.ah)(),e.components);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.h1,{id:"里氏替换原则",children:[(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#里氏替换原则",children:"#"}),"里氏替换原则"]}),"\n",(0,t.jsx)(r.Z,{defaultLocale:"zh-CN"}),"\n",(0,t.jsxs)(n.h2,{id:"简介",children:[(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#简介",children:"#"}),"简介"]}),"\n",(0,t.jsx)(n.p,{children:"里氏替换原则 (Liskov Substitution Principle, LSP) 是面向对象编程中的一个基本原则, 由芭芭拉\xb7利斯科夫 (Barbara Liskov) 在 1987 年首次提出. 这一原则表述了一个非常重要的思想: 在软件中, 子类应当能够替换他们的基类 (父类) 而不影响程序的正确性. 换句话说, 任何可以使用基类的地方, 都应该可以使用子类而不引发错误或导致程序行为变化."}),"\n",(0,t.jsx)(n.p,{children:"具体来说, 里氏替换原则强调了一下几点"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"行为一致性: 子类应当保持父类的行为约定, 这意味着子类不应改变父类已经承诺的接口行为"}),"\n",(0,t.jsx)(n.li,{children:"扩展而非修改: 子类可以扩展父类的功能, 但不得修改父类已有的功能, 以确保使用父类的客户端代码不会因为替换为子类而受到影响"}),"\n",(0,t.jsx)(n.li,{children:"合约一致性: 子类应当遵守与基类相同的前置条件和后置条件, 以及不变量, 这是保证替换安全性的关键"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"遵循里氏替换原则的好处:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"提高代码的可维护性和可扩展性: 允许我们在不修改现有代码的情况下添加新功能"}),"\n",(0,t.jsx)(n.li,{children:"增强软件的稳定性: 减少因类之间不恰当的继承关系而导致的错误"}),"\n",(0,t.jsxs)(n.li,{children:["支持",(0,t.jsx)(n.a,{href:"/toolset/wiki/SOLID/OCP",children:"开闭原则"}),": 帮助实现对修改关闭, 对扩展开放的设计目标, 从而更容易应对需求变化"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"简而言之, 里氏替换原则是知道我们如何正确设计继承关系的原则, 确保软件设计的灵活性和可靠性"})]})}function a(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,t.jsx)(n,Object.assign({},e,{children:(0,t.jsx)(l,e)})):l(e)}let c=a;a.__RSPRESS_PAGE_META={},a.__RSPRESS_PAGE_META["wiki%2FSOLID%2FLSP.md"]={toc:[{id:"简介",text:"简介",depth:2}],title:"里氏替换原则",frontmatter:{}}},2287:function(e,n,i){i.d(n,{Z:function(){return c}});var t=i(2676),s=i(5271),r=i(2117);i(4986);let l={"zh-CN":e=>`预计阅读时间: ${e.minutes>=1?`${Math.ceil(e.minutes)} 分钟`:"小于 1 分钟"}`,"en-US":e=>`Estimated reading time: ${e.minutes>=1?`${Math.ceil(e.minutes)} minutes`:"less than 1 minute"}`};function a(e,n,i){let t=Object.keys(l).includes(n)?n:i;return l[t](e)}let c=e=>{let{defaultLocale:n="en-US"}=e,i=(0,r.Vi)().page.readingTimeData,l=(0,r.Jr)(),c=(0,r.e7)(),[h,d]=(0,s.useState)(a(i,l,n));return(0,s.useEffect)(()=>{d(a(i,l,n))},[l,i]),(0,t.jsx)("span",{"data-dark":String(c),className:"rp-reading-time",children:h})}}}]);