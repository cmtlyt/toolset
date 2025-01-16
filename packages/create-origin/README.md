# 起源命令行

一个用于创建 **项目** / **npm** 包的命令行工具

添加框架流程

1. 补充解析插件信息 (src/constant/plugin-map.ts)
2. 补充导入插件语句 (src/constant/import-expression.ts)
3. 调整 tsconfig (template-source/other-config/tsconfig.ts)
4. 调整 env (template-source/other/${builder}-env.d.ts)
5. 添加框架支持 (src/constant/frame-support.ts)
