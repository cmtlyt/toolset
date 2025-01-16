import fs from 'node:fs';
import path from 'node:path';
import { versionBump } from 'bumpp';
import chalk from 'chalk';
import { globSync } from 'glob';
import prompt from 'prompts';

async function selectPackage(packages: string[]) {
  const choices = packages.map((pkg) => {
    const packageJson = JSON.parse(fs.readFileSync(pkg, 'utf-8'));
    const { name, version } = packageJson;
    return { title: `${name} v${version}`, value: { name, cwd: path.dirname(pkg), version } };
  });
  const { pkgs } = await prompt({ type: 'autocompleteMultiselect', name: 'pkgs', choices, message: '请选择需要更新版本的包', instructions: false });
  return pkgs;
}

async function patchVersion(cwd: string) {
  await versionBump({ cwd, commit: false, tag: false, noGitCheck: true, push: false, confirm: false, files: ['package.json'] });
}

(async function run() {
  const packages = globSync('packages/*/package.json', { absolute: true, ignore: ['**/node_modules/**'] });
  const dumpPackages = await selectPackage(packages);
  if (!dumpPackages || !dumpPackages.length)
    return;
  for (const pkgInfo of dumpPackages) {
    const { cwd, name } = pkgInfo;
    console.log(chalk.blue(`--- bumpp ${name} start ---`));
    await patchVersion(cwd);
    console.log(chalk.green(`--- bumpp ${name} success ---`));
  }
})();
