import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { ESLint } from 'eslint';
import { effectRestrictionConfig } from '../eslint.config.js';

const sourceExtensions = /\.(?:[cm]?[jt]sx?)$/i;
const repositoryRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const appPrefix = `${path.relative(repositoryRoot, process.cwd()).replaceAll('\\', '/')}/`;

function appRelativePath(filePath) {
  return filePath.startsWith(appPrefix) ? filePath.slice(appPrefix.length) : filePath;
}

export function stagedSourcePaths(statusOutput) {
  const fields = statusOutput.split('\0').filter(Boolean);
  const paths = [];

  for (let index = 0; index < fields.length;) {
    const status = fields[index++];
    const path = fields[index++];
    const nextPath = status?.startsWith('R') || status?.startsWith('C') ? fields[index++] : path;
    if (!nextPath || status.startsWith('D') || status.startsWith('?') || !sourceExtensions.test(nextPath)) continue;
    paths.push(appRelativePath(nextPath));
  }

  return paths;
}

export function readStagedFile(path) {
  return execFileSync('git', ['show', `:${appPrefix}${path}`], { encoding: 'utf8' });
}

export async function lintEffectText(text, filePath) {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [effectRestrictionConfig],
  });
  return eslint.lintText(text, { filePath, warnIgnored: false });
}

export async function lintEffectsInFiles() {
  const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: [effectRestrictionConfig] });
  return eslint.lintFiles(['src/**/*.{js,jsx,ts,tsx}']);
}

export async function lintStagedEffects(statusOutput, readFile = readStagedFile) {
  const results = [];
  for (const path of stagedSourcePaths(statusOutput)) {
    results.push(...(await lintEffectText(readFile(path), path)));
  }
  return results;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const status = execFileSync('git', ['diff', '--cached', '--name-status', '-z'], {
    encoding: 'utf8',
  });
  const results = await lintStagedEffects(status);
  const errors = results.flatMap((result) =>
    result.messages
      .filter(({ severity }) => severity === 2)
      .map((message) => ({ ...message, filePath: result.filePath })),
  );
  if (errors.length > 0) {
    for (const error of errors) {
      process.stderr.write(`${error.filePath}:${error.line}:${error.column} ${error.message}\n`);
    }
    process.exitCode = 1;
  }
}
