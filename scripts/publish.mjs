import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import * as argon2 from 'argon2';
import * as semver from 'semver';
import fg from 'fast-glob';
import chalk from 'chalk';
import prompt from 'prompts';
import { format } from 'prettier';

function normalizeConfig(config) {
  return {
    force: false,
    skipCheck: false,
    optCode: '',
    customPublish: false,
    usePassword: false,
    packagesPath: 'packages/**/package.json',
    ...config,
  };
}

const getPrettierOptions = (() => {
  let option;
  const root = process.cwd();
  return () => {
    return (
      option ||
      (option = { parser: 'json', ...JSON.parse(fs.readFileSync(path.resolve(root, './.prettierrc'), 'utf-8')) })
    );
  };
})();

const getConfig = (() => {
  const configMap = [
    ['force', ['-f', '--force'], () => true],
    ['skipCheck', ['-s', '--skip-check'], () => true],
    ['optCode', ['-o', '--opt'], (value) => value],
    ['customPublish', ['-c', '--custom-publish'], () => true],
    ['usePassword', ['-p', '--use-password'], () => true],
    ['packagesPath', ['--path'], (value) => value],
  ];

  let config;
  return () => {
    if (config) return config;
    const argv = process.argv.slice(2);
    const temp = argv.reduce((dist, item) => {
      const [field, value] = item.split('=');
      const [key, , getValue] = configMap.find(([, k]) => k.includes(field.trim())) || [];
      if (key) dist[key] = getValue(value);
      return dist;
    }, {});
    return (config = normalizeConfig(temp));
  };
})();

function exportError(err) {
  if (err) {
    console.log(chalk.red('--- 出错了 ---'));
    console.log(err);
    process.exit(1);
  }
}

async function execCommand(command, autoExport = true) {
  return new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      autoExport && exportError(err);
      resolve([...(autoExport ? [] : [err]), stdout, stderr]);
    });
  });
}

async function getFiles() {
  const { customPublish } = getConfig();
  if (customPublish) {
    const allPackageFiles = getAllPackageFilePath();
    return [[], allPackageFiles];
  }
  const [stdout] = await execCommand('git diff-tree --no-commit-id --name-only -r HEAD');
  const files = stdout
    .split('\n')
    .filter(Boolean)
    .map((file) => path.normalize(path.resolve(file)));
  const packageFiles = files.filter((file) => file.includes('package.json'));
  return [files, packageFiles];
}

function changePwd(file) {
  process.chdir(path.dirname(file));
}

const pkgNameMap = {};

const readJsonFile = (() => {
  const cache = {};
  return (file, forceRead = false) => {
    if (forceRead) return fs.readFileSync(file, 'utf8');
    if (file in cache) return cache[file];
    const content = fs.readFileSync(file, 'utf8');
    const pkgJson = (cache[file] = JSON.parse(content));
    pkgNameMap[pkgJson.name] ||= file;
    return pkgJson;
  };
})();

function getAllPackageFilePath() {
  const { packagesPath } = getConfig();
  const allPkgFilePaths = fg.sync(packagesPath, {
    absolute: true,
    ignore: ['**/node_modules/**'],
  });
  return allPkgFilePaths;
}

function getPkgJson(pkgName) {
  if (pkgName in pkgNameMap) {
    return readJsonFile(pkgNameMap[pkgName]);
  }
  const allPkgFilePaths = getAllPackageFilePath();
  for (const key in allPkgFilePaths) {
    const path = allPkgFilePaths[key];
    const pkgInfo = readJsonFile(path);
    if (pkgInfo.name === pkgName) return pkgInfo;
  }
}

function checkNeedPublish(files, packageFile, clPublishConfig) {
  const { checkDir } = clPublishConfig || {};
  if (!checkDir) return false;
  const dirname = path.dirname(packageFile);
  const matchFiles = [checkDir.map((reg) => fg.sync(reg, { cwd: dirname, absolute: true })), packageFile]
    .flat(Infinity)
    .map((item) => path.normalize(item));
  return files.some((file) => matchFiles.includes(file));
}

async function checkLocalCommitStatus() {
  const { skipCheck } = getConfig();
  if (skipCheck) return;
  const [stdout] = await execCommand('git diff-index --name-only HEAD');
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

async function searchPkgVersionFormNpm(pkgFile) {
  const pkgInfo = readJsonFile(pkgFile);
  if (pkgInfo.version === '0.0.0') return [, pkgInfo.version];
  const [stdout] = await execCommand(`npm search ${pkgInfo.name} --json --registry https://registry.npmjs.org/`);
  const npmPkgSearchResults = JSON.parse(stdout);
  const npmPkgInfo = npmPkgSearchResults.find((info) => info.name === pkgInfo.name);
  return [npmPkgInfo?.version, pkgInfo.version];
}

async function checkVersionUpgrade(pkgFile) {
  const [stdout] = await execCommand(`git diff HEAD^ HEAD -- ${pkgFile}`);
  const reg = /(-\s+"version":\s*"(.*?)").*?\+\s+"version":\s*"(.*?)"/s;
  let [, , oldVersion, newVersion] = reg.exec(stdout) || [];
  if (!oldVersion || !newVersion) {
    [oldVersion, newVersion] = await searchPkgVersionFormNpm(pkgFile);
    if (!newVersion || newVersion === '0.0.0') return false;
    if (!oldVersion) return true;
  }
  return semver.lt(oldVersion, newVersion);
}

async function asyncFilter(arr, callback) {
  return (await Promise.all(arr.map(async (item) => ((await callback(item)) ? item : null)))).filter(Boolean);
}

async function filterNeedPublishPackage(files, pkgFiles) {
  const { customPublish } = getConfig();
  const temp = pkgFiles.filter((file) => {
    const { clPublish } = readJsonFile(file);
    if (customPublish && clPublish) return true;
    return checkNeedPublish(files, file, clPublish);
  });
  return asyncFilter(temp, (file) => checkVersionUpgrade(file));
}

async function checkPassword() {
  const { usePassword } = getConfig();
  if (!usePassword) return;
  const homeDir = os.homedir();
  const passHash = fs.readFileSync(path.join(homeDir, '.cl-publish-hash'), 'utf-8');
  const { password } = await prompt({ type: 'password', name: 'password', message: '请输入密码' });
  if (!(await argon2.verify(passHash, password))) return exportError('密码错误');
}

function formatJson(json) {
  return json.trimEnd() + '\n';
}

async function fetchWorkspaceVersion(pkgFile) {
  const pkgVerMap = { dependencies: [], devDependencies: [] };
  const pkgInfo = readJsonFile(pkgFile);
  const action = (depType) => {
    const deps = pkgInfo[depType];
    for (const pkgName in deps) {
      const pkgVersion = deps[pkgName];
      if (pkgVersion.includes('workspace:')) {
        const tPkgInfo = getPkgJson(pkgName);
        const tVersion = tPkgInfo.version;
        if (!tVersion) throw new Error('无法读取 workspace 包的版本号');
        pkgVerMap[depType].push([pkgName, tVersion]);
      }
    }
  };
  action('dependencies');
  action('devDependencies');
  for (const depType in pkgVerMap) {
    const verMaps = pkgVerMap[depType];
    verMaps.forEach(([pkgName, pkgVersion]) => {
      pkgInfo[depType][pkgName] = `^${pkgVersion}`;
    });
  }
  fs.writeFileSync(pkgFile, formatJson(JSON.stringify(pkgInfo, null, 2)));
  return [pkgInfo.name, pkgFile, readJsonFile(pkgFile, true)];
}

async function rollbackWorkspacePaddingPackage(fetchPkgFiles) {
  try {
    for (const key in fetchPkgFiles) {
      const [, pkgPath, pkgOldFile] = fetchPkgFiles[key];
      const formatFile = formatJson(pkgOldFile);
      fs.writeFileSync(pkgPath, formatFile);
    }
  } catch (e) {
    console.log(chalk.red('--- 出错了 ---'));
    console.log(e);
    console.log(fetchPkgFiles);
  }
}

async function publish(pkgFiles) {
  if (!pkgFiles.length) return console.log('未选择需要发布的包, 跳过发布流程');

  const { optCode: _optCode } = getConfig();

  let optCode = _optCode;
  const fetchPkgFiles = [];

  const action = async (pkgFile, reInputCode = false) => {
    const fetchPkgFile = await fetchWorkspaceVersion(pkgFile);
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
      fetchPkgFiles.push(fetchPkgFile);
      // console.log(chalk.blue(`开始打包 ${name}@${version}`));
      // console.time(`build ${name}@${version}`);
      // await execCommand(`pnpm run build`);
      // console.timeEnd(`build ${name}@${version}`);
      // console.log(chalk.green(`打包 ${name}@${version} 成功`));
    }
    console.log(chalk.blue(`开始发布 ${name}@${version}`));
    const [error] = await execCommand(`npm publish ${optCode ? `--otp=${optCode}` : ''}`, false);
    if (error?.message?.includes('This operation requires a one-time password from your authenticator.')) {
      console.log(chalk.red(`OTP 码过期, 请重新输入 OTP 码`));
      return action(pkgFile, true);
    }
    const authCheckReg = /npm error need auth This command requires you to be logged in to (.*?)\n.*?using `(.*?)`/;
    const authCheck = authCheckReg.exec(error?.message || '');
    if (authCheck) {
      const [registryUrl, commandTip] = Array.from(authCheck);
      console.log(`发布 ${name} 需要在 ${registryUrl} 登陆, 尝试使用 \`${commandTip} --registry ${registryUrl}\``);
      process.exit(1);
    }
    rollbackWorkspacePaddingPackage(fetchPkgFiles);
    exportError(error);
    console.log(chalk.green(`发布 ${name}@${version} 成功\n`));
  };

  try {
    for (const idx in pkgFiles) {
      const pkgFile = pkgFiles[idx];
      // const { name } = readJsonFile(pkgFile);
      // console.log(chalk.blue(`开始安装 ${name} 依赖`));
      // await execCommand(`pnpm i`);
      // console.log(chalk.blue(`安装 ${name} 依赖成功`));
      await action(pkgFile);
    }
  } finally {
    await rollbackWorkspacePaddingPackage(fetchPkgFiles);
  }
}

async function getPkgMap(pkgFiles) {
  return pkgFiles.reduce((dic, file) => {
    const { name, version } = readJsonFile(file);
    dic[name] = [version, file];
    return dic;
  }, {});
}

async function selectPublishPkgs(pkgMap) {
  const choices = [{ title: 'all', value: 'all' }];
  for (const pkgName in pkgMap) {
    const [pkgVersion, pkgPath] = pkgMap[pkgName];
    choices.push({ title: `${pkgName}@${pkgVersion}`, value: pkgPath, disabled: pkgVersion === '0.0.0' });
  }
  const { pkgs } = await prompt({
    type: 'autocompleteMultiselect',
    name: 'pkgs',
    choices,
    message: '请选择需要发布的包',
    instructions: false,
  });
  return pkgs.includes('all') ? Object.values(pkgMap).map(([, path]) => path) : pkgs || [];
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
