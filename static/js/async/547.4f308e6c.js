"use strict";(self.webpackChunk_cmtlyt_document=self.webpackChunk_cmtlyt_document||[]).push([["547"],{8791:function(e,n,r){r.r(n);var s=r(1549),t=r(6603),c=r(9603);function a(e){let n=Object.assign({h1:"h1",a:"a",details:"details",summary:"summary",div:"div",pre:"pre",code:"code",h2:"h2",p:"p",strong:"strong",table:"table",thead:"thead",tr:"tr",th:"th",tbody:"tbody",td:"td"},(0,t.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.h1,{id:"cmtlytjson-schema",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#cmtlytjson-schema",children:"#"}),"@cmtlyt/json-schema"]}),"\n",(0,s.jsx)(c.Z,{defaultLocale:"zh-CN"}),"\n",(0,s.jsxs)(n.details,{className:"rspress-directive details",children:[(0,s.jsx)(n.summary,{className:"rspress-directive-title",children:"\u7C7B\u578B\u8865\u5145"}),(0,s.jsx)(n.div,{className:"rspress-directive-content",children:(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:"",children:"interface Schema {\r\n  type: string;\r\n  description: string;\r\n  properties?: Record<string, Schema>;\r\n  required?: string[];\r\n  items?: Schema;\r\n  maxLength?: number;\r\n  minLength?: number;\r\n}\r\ntype TObject<T> = Record<string | number | symbol, T>;\r\ntype MockHandlerMap = {\r\n  string: () => string;\r\n  number: () => number;\r\n  boolean: () => boolean;\r\n  array: () => any[];\r\n  object: () => {};\r\n};\n"})})})]}),"\n",(0,s.jsxs)(n.h2,{id:"jsonschemagenerator",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#jsonschemagenerator",children:"#"}),"jsonSchemaGenerator"]}),"\n",(0,s.jsx)(n.p,{children:"json schema \u751F\u6210\u5668"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u7C7B\u578B\u58F0\u660E"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:"",children:"function jsonSchemaGenerator(data: TObject<any>): Schema;\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u53C2\u6570"})}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{align:"center",children:"\u5FC5\u586B"}),(0,s.jsx)(n.th,{children:"\u53C2\u6570"}),(0,s.jsx)(n.th,{children:"\u8BF4\u660E"}),(0,s.jsx)(n.th,{children:"\u7C7B\u578B"}),(0,s.jsx)(n.th,{children:"\u9ED8\u8BA4\u503C"})]})}),(0,s.jsx)(n.tbody,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{align:"center",children:"*"}),(0,s.jsx)(n.td,{children:"data"}),(0,s.jsx)(n.td,{children:"\u6570\u636E"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"TObject<any>"})}),(0,s.jsx)(n.td,{})]})})]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"\u8FD4\u56DE\u503C"}),": ",(0,s.jsx)(n.code,{children:"Schema"})]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u793A\u4F8B"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"import { jsonSchemaGenerator } from '@cmtlyt/json-schema';\r\n\r\njsonSchemaGenerator({\r\n  name: 'John',\r\n  age: 30,\r\n  address: {\r\n    city: 'New York',\r\n    street: 'Wall Street',\r\n  },\r\n});\r\n/*\r\n{\r\n  type: 'object',\r\n  description: '',\r\n  required: ['name', 'age', 'address'],\r\n  properties: {\r\n    name: {\r\n      type: 'string',\r\n      description: '',\r\n    },\r\n    age: {\r\n      type: 'number',\r\n      description: '',\r\n    },\r\n    address: {\r\n      type: 'object',\r\n      description: '',\r\n      required: ['city', 'street'],\r\n      properties: {\r\n        city: {\r\n          type: 'string',\r\n          description: '',\r\n        },\r\n        street: {\r\n          type: 'string',\r\n          description: '',\r\n        },\r\n      },\r\n    },\r\n  },\r\n}\r\n*/\n"})}),"\n",(0,s.jsxs)(n.h2,{id:"verifybyschema",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#verifybyschema",children:"#"}),"verifyBySchema"]}),"\n",(0,s.jsx)(n.p,{children:"\u9A8C\u8BC1\u6570\u636E\u662F\u5426\u7B26\u5408 schema"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u7C7B\u578B\u58F0\u660E"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:"",children:"const verifyBySchema: (\r\n  schema: Schema,\r\n  data: TObject<any>,\r\n) => Promise<[boolean, { path: string; message: string }[] | null]>;\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u53C2\u6570"})}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{align:"center",children:"\u5FC5\u586B"}),(0,s.jsx)(n.th,{children:"\u53C2\u6570"}),(0,s.jsx)(n.th,{children:"\u8BF4\u660E"}),(0,s.jsx)(n.th,{children:"\u7C7B\u578B"}),(0,s.jsx)(n.th,{children:"\u9ED8\u8BA4\u503C"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{align:"center",children:"*"}),(0,s.jsx)(n.td,{children:"schema"}),(0,s.jsx)(n.td,{children:"schema"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"Schema"})}),(0,s.jsx)(n.td,{})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{align:"center",children:"*"}),(0,s.jsx)(n.td,{children:"data"}),(0,s.jsx)(n.td,{children:"\u6570\u636E"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"TObject<any>"})}),(0,s.jsx)(n.td,{})]})]})]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"\u8FD4\u56DE\u503C"}),": ",(0,s.jsx)(n.code,{children:"Promise<[boolean, { path: string; message: string }[] | null]>"})]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u793A\u4F8B"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"import { verifyBySchema } from '@cmtlyt/json-schema';\r\n\r\nverifyBySchema(\r\n  {\r\n    type: 'object',\r\n    properties: {\r\n      name: {\r\n        type: 'string',\r\n      },\r\n      age: {\r\n        type: 'number',\r\n      },\r\n    },\r\n  },\r\n  {\r\n    name: 'John',\r\n    age: 30,\r\n  },\r\n);\r\n/*\r\n[ true, null ]\r\n*/\r\n\r\nverifyBySchema(\r\n  {\r\n    type: 'object',\r\n    properties: {\r\n      name: {\r\n        type: 'string',\r\n      },\r\n      age: {\r\n        type: 'number',\r\n      },\r\n    },\r\n  },\r\n  {\r\n    name: 123,\r\n    age: '30',\r\n  },\r\n);\r\n/*\r\n[ false, [\r\n  {\r\n    path: '/name',\r\n    message: 'Expected type string but got number',\r\n  },\r\n  {\r\n    path: '/age',\r\n    message: 'Expected type number but got string',\r\n  },\r\n] ]\n"})}),"\n",(0,s.jsxs)(n.h2,{id:"mockfromschema",children:[(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#mockfromschema",children:"#"}),"mockFromSchema"]}),"\n",(0,s.jsx)(n.p,{children:"\u6839\u636E schema \u751F\u6210 mock \u6570\u636E"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u7C7B\u578B\u58F0\u660E"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",meta:"",children:"function mockFromSchema(schema: Schema, handlerMap?: Partial<MockHandlerMap>): any;\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u53C2\u6570"})}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{align:"center",children:"\u5FC5\u586B"}),(0,s.jsx)(n.th,{children:"\u53C2\u6570"}),(0,s.jsx)(n.th,{children:"\u8BF4\u660E"}),(0,s.jsx)(n.th,{children:"\u7C7B\u578B"}),(0,s.jsx)(n.th,{children:"\u9ED8\u8BA4\u503C"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{align:"center",children:"*"}),(0,s.jsx)(n.td,{children:"schema"}),(0,s.jsx)(n.td,{children:"schema"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"Schema"})}),(0,s.jsx)(n.td,{})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{align:"center"}),(0,s.jsx)(n.td,{children:"handlerMap"}),(0,s.jsx)(n.td,{children:"\u7C7B\u578B\u5904\u7406\u5668"}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"Partial<MockHandlerMap>"})}),(0,s.jsx)(n.td,{})]})]})]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"\u8FD4\u56DE\u503C"}),": ",(0,s.jsx)(n.code,{children:"any"})]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"\u793A\u4F8B"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",meta:"",children:"import { mockFromSchema } from '@cmtlyt/json-schema';\r\n\r\nmockFromSchema({\r\n  type: 'object',\r\n  properties: {\r\n    name: {\r\n      type: 'string',\r\n    },\r\n    age: {\r\n      type: 'number',\r\n    },\r\n  },\r\n});\r\n/*\r\n{\r\n  name: '',\r\n  age: 0,\r\n}\r\n*/\r\n\r\nmockFromSchema(\r\n  {\r\n    type: 'object',\r\n    properties: {\r\n      name: {\r\n        type: 'string',\r\n      },\r\n      age: {\r\n        type: 'number',\r\n      },\r\n    },\r\n  },\r\n  {\r\n    string: () => 'mock',\r\n  },\r\n);\r\n/*\r\n{\r\n  name: 'mock',\r\n  age: 0,\r\n}\r\n*/\n"})})]})}function i(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,t.ah)(),e.components);return n?(0,s.jsx)(n,Object.assign({},e,{children:(0,s.jsx)(a,e)})):a(e)}n.default=i,i.__RSPRESS_PAGE_META={},i.__RSPRESS_PAGE_META["packages%2FjsonSchema%2Findex.md"]={toc:[{id:"jsonschemagenerator",text:"jsonSchemaGenerator",depth:2},{id:"verifybyschema",text:"verifyBySchema",depth:2},{id:"mockfromschema",text:"mockFromSchema",depth:2}],title:"@cmtlyt/json-schema",frontmatter:{}}},9603:function(e,n,r){r(9369);var s=r(1549),t=r(4194),c=r(8893);r(6562);let a={"zh-CN":e=>`\u{9884}\u{8BA1}\u{9605}\u{8BFB}\u{65F6}\u{95F4}: ${e.minutes>=1?`${Math.ceil(e.minutes)} \u{5206}\u{949F}`:"\u5C0F\u4E8E 1 \u5206\u949F"}`,"en-US":e=>`Estimated reading time: ${e.minutes>=1?`${Math.ceil(e.minutes)} minutes`:"less than 1 minute"}`};function i(e,n,r){let s=Object.keys(a).includes(n)?n:r;return a[s](e)}n.Z=e=>{let{defaultLocale:n="en-US"}=e,r=(0,c.Vi)().page.readingTimeData,a=(0,c.Jr)(),d=(0,c.e7)(),[h,l]=(0,t.useState)(i(r,a,n));return(0,t.useEffect)(()=>{l(i(r,a,n))},[a,r]),(0,s.jsx)("span",{"data-dark":String(d),className:"rp-reading-time",children:h})}}}]);