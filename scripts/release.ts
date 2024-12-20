import { execSync } from 'node:child_process';
import process from 'node:process';
import chalk from 'chalk';
import { globSync } from 'glob';

function execCommand(command: string) {
  execSync(command, {
    stdio: [process.stdin, process.stdout, process.stderr],
  });
}

(function run() {
  const packages = globSync('packages/*', { absolute: true });

  for (const pkgPath of packages) {
    const packageName: string = pkgPath.split('/').pop()!;
    console.log(chalk.blue(`--- bumpp ${packageName} start ---`));
    process.chdir(pkgPath);
    execCommand('npx bumpp');
    console.log(chalk.green(`--- bumpp ${packageName} success ---`));
  }
})();
