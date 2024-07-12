import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import * as argon2 from 'argon2';
import * as semver from 'semver';
import fg from 'fast-glob';
import chalk from 'chalk';
import prompt from 'prompts';

const execCommand = async (command) =>
  new Promise((resolve) => exec(command, (err, stdout, stderr) => resolve([err, stdout, stderr])));

function exportError(err) {
  if (err) {
    console.log(chalk.red('--- 出错了 ---'));
    console.log(err);
    process.exit(1);
  }
}

async function getFiles() {
  const [err, stdout] = await execCommand('git diff-tree --no-commit-id --name-only -r HEAD');
  exportError(err);
  const files = stdout
    .split('\n')
    .filter(Boolean)
    .map((file) => path.resolve(file));
  const packageFiles = files.filter((file) => file.includes('package.json'));
  return [files, packageFiles];
}

function changePwd(file) {
  process.chdir(path.dirname(file));
}

const readJsonFile = (() => {
  const cache = {};
  return (file) => {
    if (file in cache) return cache[file];
    const content = fs.readFileSync(file, 'utf8');
    return (cache[file] = JSON.parse(content));
  };
})();

function checkNeedPublish(files, packageFile, clPublishConfig) {
  const { checkDir } = clPublishConfig || {};
  if (!checkDir) return false;
  const dirname = path.dirname(packageFile);
  const matchFiles = [checkDir.map((reg) => fg.sync(reg, { cwd: dirname, absolute: true })), packageFile].flat();
  return files.some((file) => matchFiles.includes(file));
}

async function checkLocalCommitStatus() {
  const [err, stdout] = await execCommand('git diff-index --name-only HEAD');
  exportError(err);
  const files = stdout.split('\n').filter(Boolean);
  if (files.length) {
    const { checkSkip } = await prompt({
      type: 'toggle',
      name: 'checkSkip',
      message: `本地存在未提交的变更, 是否跳过? (不建议跳过, 发布版本根据变更内容判断)\n${stdout}`,
      initial: false,
      active: 'yes',
      inactive: 'no',
    });
    if (checkSkip) return;
    exportError('本地存在未提交的变更, 请提交修改后再发布');
  }
}

async function checkVersionUpgrade(pkgFile) {
  const [err, stdout] = await execCommand(`git diff HEAD^ HEAD -- ${pkgFile}`);
  exportError(err);
  const reg = /(-\s+"version":\s*"(.*?)")?.*?\+\s+"version":\s*"(.*?)"/s;
  const [, oldVersion = '0.0.0', , newVersion] = reg.exec(stdout) || [];
  if (!newVersion) return false;
  return semver.lt(oldVersion, newVersion);
}

async function asyncFilter(arr, callback) {
  return (await Promise.all(arr.map(async (item) => ((await callback(item)) ? item : null)))).filter(Boolean);
}

async function filterNeedPublishPackage(files, pkgFiles) {
  const temp = pkgFiles.filter((file) => {
    const { clPublish } = readJsonFile(file, 'utf8');
    return checkNeedPublish(files, file, clPublish);
  });
  return asyncFilter(temp, (file) => checkVersionUpgrade(file));
}

async function checkPassword() {
  const homeDir = os.homedir();
  const passHash = fs.readFileSync(path.join(homeDir, '.cl-publish-hash'), 'utf-8');
  const { password } = await prompt({ type: 'password', name: 'password', message: '请输入密码' });
  if (!(await argon2.verify(passHash, password))) return exportError('密码错误');
}

async function publish(pkgFiles) {
  if (!pkgFiles.length) return console.log('未选择需要发布的包, 跳过发布流程');

  let optCode = '';

  const action = async (pkgFile, reInputCode = false) => {
    const { name, version } = readJsonFile(pkgFile);
    changePwd(pkgFile);
    if (reInputCode) {
      const { opt } = await prompt({
        type: 'password',
        name: 'opt',
        message: `请输入 npm publish 的 OTP 码`,
      });
      if (!opt) exportError('OTP 码错误');
      optCode = opt;
    } else {
      console.log(chalk.blue(`开始打包 ${name}@${version}`));
      console.time(`build ${name}@${version}`);
      const [err] = await execCommand(`npm run build`);
      exportError(err);
      console.timeEnd(`build ${name}@${version}`);
      console.log(chalk.green(`打包 ${name}@${version} 成功`));
    }
    console.log(chalk.blue(`开始发布 ${name}@${version}`));
    const [err2] = await execCommand(`npm publish ${optCode ? `--otp=${optCode}` : ''}`);
    if (err2?.message?.includes('This operation requires a one-time password from your authenticator.')) {
      console.log(chalk.red(`OTP 码过期, 请重新输入 OTP 码`));
      return action(pkgFile, true);
    }
    exportError(err2);
    console.log(chalk.green(`发布 ${name}@${version} 成功\n`));
  };

  for (const idx in pkgFiles) {
    await action(pkgFiles[idx]);
  }
}

async function getPkgMap(pkgFiles) {
  return pkgFiles.reduce((dic, file) => {
    const { name } = readJsonFile(file, 'utf8');
    dic[name] = file;
    return dic;
  }, {});
}

async function selectPublishPkgs(pkgMap) {
  const choices = [{ title: 'all', value: 'all' }];
  for (const pkgName in pkgMap) {
    choices.push({ title: pkgName, value: pkgMap[pkgName] });
  }
  const { pkgs } = await prompt({
    type: 'autocompleteMultiselect',
    name: 'pkgs',
    choices,
    message: '请选择需要发布的包',
    instructions: false,
  });
  return pkgs.includes('all') ? Object.values(pkgMap) : pkgs || [];
}

(async function main() {
  await checkPassword();

  await checkLocalCommitStatus();

  const [files, packageFiles] = await getFiles();

  const needPublishs = await filterNeedPublishPackage(files, packageFiles);

  const pkgMap = await getPkgMap(needPublishs);

  const publishPkgs = await selectPublishPkgs(pkgMap);

  await publish(publishPkgs);
})();