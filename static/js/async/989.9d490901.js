"use strict";(self.webpackChunk_cmtlyt_document=self.webpackChunk_cmtlyt_document||[]).push([["989"],{8635:function(e,n,i){i.r(n);var t=i(1549),s=i(6603),l=i(9603);function r(e){let n=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",ul:"ul",li:"li",ol:"ol"},(0,s.ah)(),e.components);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(n.h1,{id:"\u63A5\u53E3\u9694\u79BB\u539F\u5219",children:[(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u63A5\u53E3\u9694\u79BB\u539F\u5219",children:"#"}),"\u63A5\u53E3\u9694\u79BB\u539F\u5219"]}),"\n",(0,t.jsx)(l.Z,{defaultLocale:"zh-CN"}),"\n",(0,t.jsxs)(n.h2,{id:"\u7B80\u4ECB",children:[(0,t.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#\u7B80\u4ECB",children:"#"}),"\u7B80\u4ECB"]}),"\n",(0,t.jsx)(n.p,{children:"\u63A5\u53E3\u9694\u79BB\u539F\u5219 (Interface Segregation Principle, ISP) \u662F SOLID \u8BBE\u8BA1\u539F\u5219\u4E4B\u4E00, \u4ED6\u5F3A\u8C03\u5BA2\u6237\u7AEF\u4E0D\u5E94\u8BE5\u4F9D\u8D56\u4ED6\u4E0D\u9700\u8981\u7684\u63A5\u53E3. \u8FD9\u4E00\u539F\u5219\u6307\u5BFC\u6211\u4EEC\u8BBE\u8BA1\u7EC6\u7C92\u5EA6\u7684\u63A5\u53E3, \u4EE5\u51CF\u5C11\u8026\u5408\u5E76\u63D0\u9AD8\u7CFB\u7EDF\u7684\u7075\u6D3B\u6027\u548C\u53EF\u7EF4\u62A4\u6027."}),"\n",(0,t.jsx)(n.p,{children:"\u539F\u5219\u8BF4\u660E"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"\u6838\u5FC3\u601D\u60F3: \u6BCF\u4E2A\u63A5\u53E3\u5E94\u8BE5\u4E13\u6CE8\u4E8E\u63D0\u4F9B\u4E00\u7EC4\u76F8\u5173\u7684\u884C\u4E3A, \u5BA2\u6237\u7AEF\u4EC5\u9700\u6307\u5BFC\u4ED6\u6240\u5173\u5FC3\u7684\u65B9\u6CD5, \u800C\u65E0\u9700\u4E86\u89E3\u4ED6\u4E0D\u4F7F\u7528\u7684\u529F\u80FD. \u8FD9\u6837\u53EF\u4EE5\u51CF\u5C11\u4E0D\u5FC5\u8981\u7684\u4F9D\u8D56, \u4F7F\u5F97\u7CFB\u7EDF\u66F4\u52A0\u89E3\u8026"}),"\n",(0,t.jsx)(n.li,{children:"\u907F\u514D\u80D6\u63A5\u53E3: \u80D6\u63A5\u53E3 (\u5305\u542B\u5927\u91CF\u4E0D\u76F8\u5173\u65B9\u6CD5\u7684\u63A5\u53E3) \u4F1A\u8FEB\u4F7F\u5B9E\u73B0\u5B83\u7684\u7C7B\u5305\u542B\u5F88\u591A\u53EF\u80FD\u4E0D\u9700\u8981\u7684\u65B9\u6CD5, \u8FD9\u8FDD\u53CD\u4E86\u63A5\u53E3\u9694\u79BB\u539F\u5219. \u5E94\u8BE5\u5C06\u8FD9\u6837\u7684\u5927\u63A5\u53E3\u62C6\u5206\u4E3A\u591A\u4E2A\u5C0F\u800C\u5177\u4F53\u7684\u63A5\u53E3"}),"\n",(0,t.jsx)(n.li,{children:"\u5BA2\u6237\u7AEF\u5B9A\u5236\u63A5\u53E3: \u4E3A\u4E0D\u540C\u7684\u5BA2\u6237\u7AEF\u63D0\u4F9B\u5B9A\u5236\u5316\u7684\u63A5\u53E3, \u6BCF\u4E2A\u5BA2\u6237\u7AEF\u4EC5\u4F7F\u7528\u4E0E\u4E4B\u76F4\u63A5\u76F8\u5173\u7684\u63A5\u53E3, \u8FD9\u6837\u53EF\u4EE5\u786E\u4FDD\u63A5\u53E3\u7684\u7EAF\u7CB9\u6027\u548C\u5BA2\u6237\u7AEF\u7684\u7B80\u6D01\u6027"}),"\n",(0,t.jsx)(n.li,{children:"\u63D0\u9AD8\u7075\u6D3B\u6027\u548C\u53EF\u6D4B\u8BD5\u6027: \u7EC6\u7C92\u5EA6\u7684\u63A5\u53E3\u4F7F\u5F97\u66FF\u6362\u548C mock (\u5728\u6D4B\u8BD5\u4E2D\u6A21\u62DF\u5BF9\u8C61) \u53D8\u5F97\u66F4\u52A0\u5BB9\u6613, \u4ECE\u800C\u63D0\u9AD8\u4E86\u7CFB\u7EDF\u7684\u6D4B\u8BD5\u6027\u548C\u53EF\u6269\u5C55\u6027"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\u5B9E\u73B0\u65B9\u6CD5"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"\u6A21\u5757\u5316\u63A5\u53E3\u8BBE\u8BA1: \u6839\u636E\u529F\u80FD\u5C06\u63A5\u53E3\u62C6\u5206\u6210\u591A\u4E2A\u5C0F\u6A21\u5757, \u6BCF\u4E2A\u6A21\u5757\u4EE3\u8868\u4E00\u7C7B\u76F8\u5173\u64CD\u4F5C"}),"\n",(0,t.jsx)(n.li,{children:"\u4F7F\u7528\u591A\u91CD\u7EE7\u627F\u6216\u63A5\u53E3\u7EE7\u627F (\u5982\u679C\u8BED\u8A00\u652F\u6301): \u5141\u8BB8\u7C7B\u5B9E\u73B0\u591A\u4E2A\u5C0F\u63A5\u53E3, \u800C\u4E0D\u662F\u5355\u4E00\u7684\u5927\u63A5\u53E3"}),"\n",(0,t.jsx)(n.li,{children:"\u57FA\u4E8E\u89D2\u8272\u8BBE\u8BA1\u63A5\u53E3: \u8003\u8651\u7C7B\u5728\u7CFB\u7EDF\u4E2D\u7684\u89D2\u8272\u548C\u4ED6\u9700\u8981\u63D0\u4F9B\u7684\u670D\u52A1, \u636E\u6B64\u6765\u5B9A\u4E49\u63A5\u53E3"}),"\n",(0,t.jsx)(n.li,{children:"\u6301\u7EED\u5BA1\u67E5\u548C\u91CD\u6784: \u968F\u7740\u7CFB\u7EDF\u7684\u53D1\u5C55, \u5B9A\u671F\u68C0\u67E5\u63A5\u53E3\u7684\u4F7F\u7528\u60C5\u51B5, \u5373\u65F6\u62C6\u5206\u8FC7\u5927\u7684\u63A5\u53E3, \u786E\u4FDD\u63A5\u53E3\u804C\u8D23\u6E05\u6670"}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\u9075\u5FAA\u63A5\u53E3\u9694\u79BB\u539F\u5219\u53EF\u4EE5\u5E2E\u52A9\u6211\u4EEC\u6784\u5EFA\u66F4\u52A0\u7075\u6D3B\u3001\u53EF\u6269\u5C55\u7684\u7CFB\u7EDF, \u7279\u522B\u662F\u5728\u5927\u578B\u9879\u76EE\u6216\u56E2\u961F\u534F\u4F5C\u4E2D, \u4ED6\u80FD\u591F\u663E\u8457\u964D\u4F4E\u56E0\u63A5\u53E3\u6EE5\u7528\u5BFC\u81F4\u7684\u8D1F\u8D23\u6027\u548C\u6DF7\u4E71."})]})}function c(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,s.ah)(),e.components);return n?(0,t.jsx)(n,Object.assign({},e,{children:(0,t.jsx)(r,e)})):r(e)}n.default=c,c.__RSPRESS_PAGE_META={},c.__RSPRESS_PAGE_META["wiki%2FSOLID%2FISP.md"]={toc:[{id:"\u7B80\u4ECB",text:"\u7B80\u4ECB",depth:2}],title:"\u63A5\u53E3\u9694\u79BB\u539F\u5219",frontmatter:{}}},9603:function(e,n,i){i(9369);var t=i(1549),s=i(4194),l=i(8893);i(6562);let r={"zh-CN":e=>`\u{9884}\u{8BA1}\u{9605}\u{8BFB}\u{65F6}\u{95F4}: ${e.minutes>=1?`${Math.ceil(e.minutes)} \u{5206}\u{949F}`:"\u5C0F\u4E8E 1 \u5206\u949F"}`,"en-US":e=>`Estimated reading time: ${e.minutes>=1?`${Math.ceil(e.minutes)} minutes`:"less than 1 minute"}`};function c(e,n,i){let t=Object.keys(r).includes(n)?n:i;return r[t](e)}n.Z=e=>{let{defaultLocale:n="en-US"}=e,i=(0,l.Vi)().page.readingTimeData,r=(0,l.Jr)(),a=(0,l.e7)(),[h,d]=(0,s.useState)(c(i,r,n));return(0,s.useEffect)(()=>{d(c(i,r,n))},[r,i]),(0,t.jsx)("span",{"data-dark":String(a),className:"rp-reading-time",children:h})}}}]);