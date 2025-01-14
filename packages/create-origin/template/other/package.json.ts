const _default = `{
  "name": "<%= projectName %>",
  "version": "0.0.0",
  "description": "origin / <%= builder %> / <%= frame %> / <%= projectName %>",
  "scripts": {
    <% if (enableEslint) { %>
    "lint": "eslint . --fix",
    <% } %>
    "dev": "<%= scripts.builderDev %>",
    <% if (scripts.builderPreview) { %>
    "preview": "<%= scripts.builderPreview %>",
    <% } %>
    "build": "<%= scripts.builderBuild %>"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    <%# 生成生产依赖 %>
    <% dependencies.map((dep, idx, arr) =>  %>
    "<%= dep.name %>": "<%= dep.version %>"<%= idx === arr.length - 1 ? '' : ',' %>
    <% ); %>
  },
  "devDependencies": {
    <%# 生成开发依赖 %>
    <% dependencies.map((dep, idx, arr) =>  %>
    "<%= dep.name %>": "<%= dep.version %>"<%= idx === arr.length - 1 ? '' : ',' %>
    <% ); %>
    <%# = devDependencies.map(dep = => \`"\${dep.name}": "\${dep.version}\`).join('\\n,') %>
  },
  "lint-staged": {
    "*.{js,ts,vue,jsx,tsx}": [
      "eslint --cache --fix"
    ]
  }
}`.trim();

export default {
  default: _default,
};
