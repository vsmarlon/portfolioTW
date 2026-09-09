import { describe, expect, it } from 'vitest';
import { lintEffectText, lintStagedEffects, stagedSourcePaths } from './lint-effects.mjs';

async function hasErrors(source) {
  const [result] = await lintEffectText(source, 'src/fixture.tsx');
  return result.messages.filter(({ severity }) => severity === 2);
}

describe('effect restriction lint', () => {
  it.each([
    "import { useEffect as run } from 'react'; run(() => {});",
    "import * as R from 'react'; R.useLayoutEffect(() => {});",
    "import React from 'react'; const { useInsertionEffect } = React; useInsertionEffect(() => {});",
    "const react = import('react'); react.then(({ useEffect }) => useEffect(() => {}));",
    "import React from 'react'; const lifecycleEffectName = 'use' + 'Layout' + 'Effect'; const effect = (React as unknown as Record<string, unknown>)[lifecycleEffectName]; effect(() => {});",
    "import React from 'react'; const effectName = 'useEffect'; React[effectName](() => {});",
    "import React from 'react'; const effectName = 'useEffect'; const { [effectName]: effect } = React; effect(() => {});",
  ])('rejects effect API escape: %s', async (source) => {
    expect(await hasErrors(source)).not.toHaveLength(0);
  });

  it('allows normal React hooks', async () => {
    expect(await hasErrors("import { useState } from 'react'; useState(0);")).toHaveLength(0);
    expect(await hasErrors("import React from 'react'; React.useState(0);")).toHaveLength(0);
  });

  it('parses staged status safely, including spaces, renames, and deletions', () => {
    expect(
      stagedSourcePaths(
        'M\0space name.tsx\0R100\0old.tsx\0new name.tsx\0D\0deleted.tsx\0??\0untracked.tsx\0',
      ),
    ).toEqual(['space name.tsx', 'new name.tsx']);
  });

  it('lints the supplied staged blob rather than the working tree', async () => {
    const results = await lintStagedEffects('M\0src/staged.tsx\0', () => "import { useEffect } from 'react';");
    expect(results[0].messages).not.toHaveLength(0);
  });
});
