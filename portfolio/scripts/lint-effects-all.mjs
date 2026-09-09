import process from 'node:process';
import { lintEffectsInFiles } from './lint-effects.mjs';

const results = await lintEffectsInFiles();
const errors = results.flatMap((result) =>
  result.messages
    .filter(({ severity }) => severity === 2)
    .map((message) => ({ ...message, filePath: result.filePath })),
);

for (const error of errors) {
  process.stderr.write(`${error.filePath}:${error.line}:${error.column} ${error.message}\n`);
}

if (errors.length > 0) process.exitCode = 1;
