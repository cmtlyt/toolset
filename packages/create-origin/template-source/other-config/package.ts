const _default = `{
  "name": "<%= projectName %>",
  "version": "0.0.0",
  "description": "origin / <%= builder %> / <%= frame %> / <%= projectName %>",
  "author": "",
  "license": "ISC",
  "scripts": {
    <%_ if (enableEslint) { _%>
    "lint": "eslint . --fix",
    <%_ } _%>
    <%_ Object.keys(scripts).forEach((key, idx, arr) => { _%>
    "<%- key %>": "<%- scripts[key] %>"<%= idx === arr.length - 1 ? '' : ',' %>
    <%_ }) _%>
  },
  "dependencies": {
<%# 生成生产依赖 _%>
    <%_ dependencies.forEach((dep, idx, arr) => { _%>
    "<%= dep.name %>": "<%= dep.version %>"<%= idx === arr.length - 1 ? '' : ',' %>
    <%_ }) _%>
  },
  "devDependencies": {
<%# 生成开发依赖 _%>
    <%_ devDependencies.forEach((dep, idx, arr) => { _%>
    "<%= dep.name %>": "<%= dep.version %>"<%= idx === arr.length - 1 ? '' : ',' %>
    <%_ }) _%>
  }<%_ if (enableEslint) { _%>,
  "lint-staged": {
    "*.{js,ts,vue,jsx,tsx}": [
      "eslint --cache --fix"
    ]
  }
  <%_ } %>
}`.trimStart();

export default {
  default: _default,
};
