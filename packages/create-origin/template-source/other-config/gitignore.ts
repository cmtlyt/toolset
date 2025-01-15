const _default = `
dist
node_modules
.DS_Store
.idea
# 排除其他 IDE 配置
.vscode/*
# 覆盖 prettier 和 eslint 配置
!.vscode/settings.json
.temp
*.log
coverage
.eslintcache
`.trim();

export default {
  default: _default,
};
