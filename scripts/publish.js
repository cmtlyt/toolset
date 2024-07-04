const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const argon2 = require('argon2');
const semver = require('semver');

const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });

const execCommand = async (command) =>
  new Promise((resolve) => exec(command, (err, stdout, stderr) => resolve([err, stdout, stderr])));

async function getFiles() {
  const [err, stdout] = await execCommand('git diff-tree --no-commit-id --name-only -r HEAD');
  if (err) {
    console.log(err);
    process.exit(1);
  }
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
  const pwd = path.join(path.dirname(packageFile), checkDir);
  return files.some((file) => {
    return file.includes(pwd);
  });
}

async function checkLocalCommit() {
  const [err, stdout] = await execCommand('git diff-index --name-only HEAD');
  if (err) {
    console.log(err);
    process.exit(1);
  }
  const files = stdout.split('\n').filter(Boolean);
  if (files.length) {
    console.log('请先提交代码');
    process.exit(1);
  }
  resolve();
}

function filterNeedPublishPackage(files, pkgFiles) {
  return pkgFiles
    .filter((file) => {
      const { clPublish } = readJsonFile(file, 'utf8');
      return checkNeedPublish(files, file, clPublish);
    })
    .filter((file) => {
      return checkVersionUpgrade(file);
    });
}

async function checkPassword() {
  return new Promise(async (resolve) => {
    const homeDir = os.homedir();
    const passHash = fs.readFileSync(path.join(homeDir, '.cl-publish-hash'), 'utf-8');
    readline.question('请输入密码: ', async (password) => {
      if (!(await argon2.verify(passHash, password))) {
        console.log('密码错误');
        process.exit(1);
      }
      readline.close();
      resolve();
    });
  });
}

async function checkVersionUpgrade(pkgFile) {
  const [err, stdout] = await execCommand(`git diff HEAD^ HEAD -- ${pkgFile}`);
  if (err) {
    console.log(err);
    process.exit(1);
  }
  const reg = /-\s+"version":\s*"(.*?)".*?\+\s+"version":\s*"(.*?)"/s;
  const [, oldVersion, newVersion] = reg.exec(stdout) || [];
  if (!oldVersion || !newVersion) return false;
  return semver.lt(oldVersion, newVersion);
}

async function publish(pkgFiles) {
  for (const idx in pkgFiles) {
    changePwd(pkgFiles[idx]);
    const { name, version } = readJsonFile(pkgFiles[idx]);
    console.log(`开始打包 ${name}@${version}`);
    await execCommand(`npm run build`);
    console.log(`打包 ${name}@${version} 成功`);
    console.log(`开始发布 ${name}@${version}`);
    await execCommand(`npm publish`);
    console.log(`发布 ${name}@${version} 成功`);
  }
}

(async function main() {
  await checkPassword();

  await checkLocalCommit();

  const [files, packageFiles] = await getFiles();

  const needPublishs = filterNeedPublishPackage(files, packageFiles);

  await publish(needPublishs);
})();
