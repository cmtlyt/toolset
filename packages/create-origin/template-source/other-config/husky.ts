const _default = {
  '.husky/commit-msg': `npx --no-install commitlint -e $HUSKY_GIT_PARAMS`,
  '.husky/pre-commit': `npx --no -- lint-staged`,
};

export default {
  default: _default,
};
