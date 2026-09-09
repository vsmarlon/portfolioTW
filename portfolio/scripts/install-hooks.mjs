import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const gitHooksDirectory = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], { encoding: 'utf8' }).trim();
const source = path.join(scriptDirectory, '..', '.githooks', 'pre-commit');
const targetDirectory = path.isAbsolute(gitHooksDirectory)
  ? gitHooksDirectory
  : path.resolve(process.cwd(), gitHooksDirectory);
const target = path.join(targetDirectory, 'pre-commit');

mkdirSync(targetDirectory, { recursive: true });
if (existsSync(target)) {
  if (!readFileSync(source).equals(readFileSync(target))) {
    throw new Error(`Refusing to overwrite existing hook at ${target}`);
  }
} else {
  copyFileSync(source, target);
}
chmodSync(target, 0o755);
process.stdout.write(`Installed pre-commit hook at ${target}\n`);
