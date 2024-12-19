"use strict";(self.webpackChunk_cmtlyt_toolset=self.webpackChunk_cmtlyt_toolset||[]).push([["5178"],{5273:function(e,n,r){r.r(n),r.d(n,{default:function(){return i}});var s=r(2676),a=r(453),c=r(2287);function d(e){let n=Object.assign({h1:"h1",a:"a",h2:"h2",p:"p",pre:"pre",code:"code",h3:"h3",h4:"h4",ol:"ol",li:"li",strong:"strong"},(0,a.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.h1,{id:"数据类型转换",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#数据类型转换",children:"#"}),"数据类型转换"]}),"\n",(0,s.jsx)(c.Z,{defaultLocale:"zh-CN"}),"\n",(0,s.jsxs)(n.h2,{id:"数据类型转换介绍",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#数据类型转换介绍",children:"#"}),"数据类型转换介绍"]}),"\n",(0,s.jsx)(n.p,{children:"JavaScript是一种动态类型语言,变量没有类型限制,可以随时赋予任意值"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"const a = y ? 1 : '2';\n"})}),"\n",(0,s.jsx)(n.p,{children:"上面代码中a的值是数字还是字符串取决于y的值是真还是假,也就是说a在编译的时候并不知道具体的类型,只有在运行的时候才能得到y的值然后知道a的类型"}),"\n",(0,s.jsx)(n.p,{children:"虽然变量的数据类型是不确定的,但是各种运算符对数据类型是有要求的  如果运算符发现,运算子的类型与预期不符,就会自动转换类型  比如,减法运算符逾期左右两边的运算子都是数值,如果不是,就会自动将他们转为数值"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"'4' - '3' // 1\n"})}),"\n",(0,s.jsx)(n.p,{children:"上面代码中,虽然是两个字符串相减,但是依然得到了1,因为JavaScript自动将他们的类型做了转换"}),"\n",(0,s.jsx)(n.p,{children:"接下来我们就来聊一聊JavaScript中怎么进行数据类型的转换"}),"\n",(0,s.jsxs)(n.h2,{id:"强制转换显示类型转换",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#强制转换显示类型转换",children:"#"}),"强制转换(显示类型转换)"]}),"\n",(0,s.jsxs)(n.p,{children:["强制类型转换主要使用",(0,s.jsx)(n.code,{children:"Number()"}),",",(0,s.jsx)(n.code,{children:"String()"}),",",(0,s.jsx)(n.code,{children:"Boolean()"}),"这3个函数,手动将各种类型的值分别转换为数字,字符串或者布尔值"]}),"\n",(0,s.jsxs)(n.h3,{id:"number",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#number",children:"#"}),"Number()"]}),"\n",(0,s.jsxs)(n.p,{children:["使用",(0,s.jsx)(n.code,{children:"Number"}),"函数可以将任意的值转化为数值"]}),"\n",(0,s.jsx)(n.p,{children:"下面分成两种情况讨论,一种参数是原始类型的值,另一种是对象类型"}),"\n",(0,s.jsxs)(n.h4,{id:"原始类型",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#原始类型",children:"#"}),"原始类型"]}),"\n",(0,s.jsx)(n.p,{children:"原始类型的转换规则如下"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"// 数值: 转换后还是原来的值\nNumber(123) // 123\n// 字符串: 如果可以被解析为数值,则转换为对应的值  如果不能被解析为数值的话就会返回NaN  如果是空字符串的话则会返回0\nNumber('123') // 123\nNumber('123asdf') // NaN\nNumber('') // 0\n// 布尔值: true转换为1,false转换为0\nNumber(true) // 1\nNumber(false) // 0\n// undefined: 转换为NaN\nNumber(undefined) // NaN\n// null: 转换为0\nNumber(null) // 0\n"})}),"\n",(0,s.jsx)(n.p,{children:"这里我们特别讨论一下字符串转数值"}),"\n",(0,s.jsxs)(n.p,{children:["我们知道,字符串转数值除了",(0,s.jsx)(n.code,{children:"Number"}),"之外还可以用",(0,s.jsx)(n.code,{children:"parseInt"}),"或者",(0,s.jsx)(n.code,{children:"parseFloat"})]}),"\n",(0,s.jsxs)(n.p,{children:["咱们用过的都知道",(0,s.jsx)(n.code,{children:"parseInt"}),"和",(0,s.jsx)(n.code,{children:"parseFloat"}),"这两个方法把字符串解析为数值的时候都不怎么介意字符串中出现除数字外的字符"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"Number('123asdf') // NaN\nparseInt('123asdf') // 123\nparseFloat('123asdf') // 123\nNumber('123.111') // 123.111\nparseInt('123.11a1aaaa') // 123\nparseFloat('123.11a1aaaa') // 123.11\n"})}),"\n",(0,s.jsx)(n.p,{children:"我们从上面的5/6行也能看出他们俩只要遇到了非数值之后就不解析了,不管你后面有没有数值都不解析了,就好像一个不是舔狗的打工人一样,数值就是他的工钱,我帮你解析一个字符,你就要给我一份工钱,如果你这个字符不是数值,那就相当于你赖账了,那我就不给你继续上班了,这个灵魂比喻应该还是比较形象的,嘿嘿"}),"\n",(0,s.jsxs)(n.p,{children:["当然,虽然人家相对",(0,s.jsx)(n.code,{children:"Number"}),"来说大气很多,但是也有特殊情况,就比如下面这两种"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"parseInt('a123') // NaN\nparseFloat('a123') // NaN\n"})}),"\n",(0,s.jsxs)(n.p,{children:["你一开头就给人家一个非数字,别人什么好处都没有呢,当然直接就不给你解析了,随便甩给你一个",(0,s.jsx)(n.code,{children:"NaN"}),"就完事了,你说是吧"]}),"\n",(0,s.jsxs)(n.h4,{id:"对象",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#对象",children:"#"}),"对象"]}),"\n",(0,s.jsx)(n.p,{children:"转换对象我们可以先来看几个例子"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"Number({a: 1}) // NaN\nNumber([1, 2, 3]) // NaN\nNumber([1]) // 1\n"})}),"\n",(0,s.jsx)(n.p,{children:"欸,第一个我理解,他是对象没法转成数值,那第二个和第三个都是数组,为什么一个可以转换另一个不能转换呢?"}),"\n",(0,s.jsx)(n.p,{children:"好,现在我们就来探讨一下他为啥一下可以一下不可以吧"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Number"}),"他去转换的时候,发现你给他的是个对象,那对象怎么转换成数值啊,没有办法把,这个时候他就会通过其他方法,把你的对象转为自己认识的原始类型"]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["调用对象",(0,s.jsx)(n.strong,{children:"自身"}),"的",(0,s.jsx)(n.code,{children:"valueOf"}),"方法,如果返回原始类型的值,则直接对这个值使用",(0,s.jsx)(n.code,{children:"Number"}),"函数"]}),"\n",(0,s.jsxs)(n.li,{children:["如果调用",(0,s.jsx)(n.code,{children:"valueOf"}),"返回的还是一个对象的话,就调用对象",(0,s.jsx)(n.strong,{children:"自身"}),"的",(0,s.jsx)(n.code,{children:"toString"}),"方法,如果返回原始类型的值,则对该值调用",(0,s.jsx)(n.code,{children:"Number"}),"方法"]}),"\n",(0,s.jsx)(n.li,{children:"报错"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["这就是",(0,s.jsx)(n.code,{children:"Number"}),"函数转换对象时的心路历程了,",(0,s.jsx)(n.code,{children:"valueOf -> toString -> Error"})]}),"\n",(0,s.jsx)(n.p,{children:"我们来模仿一下这个心路历程吧"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"function toNumber(val){\n  let value = val\n  if(typeof value === 'object') {\n    value = val.valueOf()\n  }\n  if(typeof value === 'object') {\n    value = val.toString()\n  }\n  if(typeof value === 'object'){\n    throw new Error()\n  }\n  return Number(value)\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"这段代码差不多就是他的心路历程了,一次次的确认他是不是object,就像你的对象一次次确认你是不是爱他一样,如果每次都是不爱,那我直接爆炸,只要有一次你爱我了,我就给你想要的(这么说好像舔狗)"}),"\n",(0,s.jsx)(n.p,{children:"好了那我们现在来看看争议最大的数组吧"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"[1, 2, 3].valueOf() // [1, 2, 3]\n[1, 2, 3].toString() // '1,2,3'\nNumber('1,2,3') // NaN\n\n[1].valueOf() // [1]\n[1].toString() // '1'\nNumber('1') // 1\n\n[].valueOf() // []\n[].toString() // ''\nNumber('') // 0\n"})}),"\n",(0,s.jsx)(n.p,{children:"是吧是吧,没有一点点争议对吧~"}),"\n",(0,s.jsxs)(n.p,{children:["当然这个",(0,s.jsx)(n.code,{children:"toString"}),"和",(0,s.jsx)(n.code,{children:"valueOf"}),"方法我们也可以自己重写掉,我这里拿对象来举个例子吧"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"const obj = {\n  valueOf() {\n    return 123\n  }\n}\nNumber(obj) // 123\n\nconst obj2 = {\n  toString() {\n    return '123'\n  }\n}\nNumber(obj2) // 123\n\nconst obj3 = {\n  valueOf() {\n    return obj\n  },\n  toString() {\n    return '234'\n  }\n}\nNumber(obj3) // 234\n\nconst obj4 = {\n  toString() {\n    return obj\n  }\n}\nNumber(obj4) // TypeError: Cannot convert object to primitive value\n"})}),"\n",(0,s.jsxs)(n.p,{children:["看到这大家会不会很好奇",(0,s.jsx)(n.code,{children:"obj3"}),"为什么返回的是234而不是",(0,s.jsx)(n.code,{children:"obj.valueOf"}),"返回的123呢?"]}),"\n",(0,s.jsxs)(n.p,{children:["其实大家前面仔细看的话就会发现,",(0,s.jsx)(n.code,{children:"Number"}),"类型转的心路历程中关心的一直都是你",(0,s.jsx)(n.strong,{children:"传入的那个对象"}),",跟你的返回值没啥关系"]}),"\n",(0,s.jsxs)(n.h2,{id:"自动转换隐式类型转换",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#自动转换隐式类型转换",children:"#"}),"自动转换(隐式类型转换)"]}),"\n",(0,s.jsx)(n.p,{children:"JavaScript遇到逾期和实际不符的地方就会进行数据类型的转换,我们先来看几个例子"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"'5' - '2' // 3\n'5' * '2' // 10\ntrue - 1 // 0\nfalse - 1 // -1\n'1' - 1 // 0\n'5' * [] // 0\nfalse / 5 // 0\n'1abc' - 1 // NaN\nnull + 1 // 1\nundefined + 1 // NaN\n"})}),"\n",(0,s.jsxs)(n.p,{children:["这些例子中运算符两侧的运算子都被转成了数值进行运算  从",(0,s.jsx)(n.code,{children:"‘abc’ - 1"}),"这个例子里我们就可以看出它内部类型转换的时候调用的是",(0,s.jsx)(n.code,{children:"Number"}),"方法"]}),"\n",(0,s.jsx)(n.p,{children:"当然一元运算符也会把运算子转换成数值"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"+'123' // 123\n-'123' // -123\n+'asd' // NaN\n-'asd' // NaN\n+true // 1\n-false // 0\n"})})]})}function l(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,a.ah)(),e.components);return n?(0,s.jsx)(n,Object.assign({},e,{children:(0,s.jsx)(d,e)})):d(e)}let i=l;l.__RSPRESS_PAGE_META={},l.__RSPRESS_PAGE_META["wiki%2Fjavascript%2FdataTransform.md"]={toc:[{id:"数据类型转换介绍",text:"数据类型转换介绍",depth:2},{id:"强制转换显示类型转换",text:"强制转换(显示类型转换)",depth:2},{id:"number",text:"Number()",depth:3},{id:"原始类型",text:"原始类型",depth:4},{id:"对象",text:"对象",depth:4},{id:"自动转换隐式类型转换",text:"自动转换(隐式类型转换)",depth:2}],title:"数据类型转换",frontmatter:{}}},2287:function(e,n,r){r.d(n,{Z:function(){return i}});var s=r(2676),a=r(5271),c=r(2117);r(4986);let d={"zh-CN":e=>`预计阅读时间: ${e.minutes>=1?`${Math.ceil(e.minutes)} 分钟`:"小于 1 分钟"}`,"en-US":e=>`Estimated reading time: ${e.minutes>=1?`${Math.ceil(e.minutes)} minutes`:"less than 1 minute"}`};function l(e,n,r){let s=Object.keys(d).includes(n)?n:r;return d[s](e)}let i=e=>{let{defaultLocale:n="en-US"}=e,r=(0,c.Vi)().page.readingTimeData,d=(0,c.Jr)(),i=(0,c.e7)(),[t,h]=(0,a.useState)(l(r,d,n));return(0,a.useEffect)(()=>{h(l(r,d,n))},[d,r]),(0,s.jsx)("span",{"data-dark":String(i),className:"rp-reading-time",children:t})}}}]);