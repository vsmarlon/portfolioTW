import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

const forbiddenEffectNames = ['useEffect', 'useLayoutEffect', 'useInsertionEffect'];

const noDynamicReactMember = {
  meta: { type: 'problem', schema: [] },
  create(context) {
    const unwrapIdentifier = (node) => {
      let current = node;
      while (current?.type === 'TSAsExpression' || current?.type === 'TSTypeAssertion') {
        current = current.expression;
      }
      return current?.type === 'Identifier' ? current.name : undefined;
    };

    return {
      'Program:exit'(program) {
        const reactBindings = new Set();
        const aliases = [];
        const visit = (node) => {
          if (!node || typeof node !== 'object') return;
          if (node.type === 'ImportDeclaration' && node.source.value === 'react') {
            for (const specifier of node.specifiers) {
              if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportNamespaceSpecifier') {
                reactBindings.add(specifier.local.name);
              }
            }
          }
          if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
            aliases.push([node.id.name, unwrapIdentifier(node.init)]);
          }
          for (const [key, value] of Object.entries(node)) {
            if (key === 'parent' || key === 'tokens' || key === 'comments') continue;
            if (Array.isArray(value)) value.forEach(visit);
            else if (value && typeof value === 'object') visit(value);
          }
        };

        let previousSize;
        do {
          previousSize = reactBindings.size;
          for (const [alias, source] of aliases) {
            if (source && reactBindings.has(source)) reactBindings.add(alias);
          }
        } while (reactBindings.size !== previousSize);

        const reportDynamicMembers = (node) => {
          if (!node || typeof node !== 'object') return;
          if (
            node.type === 'MemberExpression' &&
            node.computed &&
            node.property.type === 'Identifier' &&
            reactBindings.has(unwrapIdentifier(node.object))
          ) {
            context.report({ node, message: 'Dynamic React member access is not allowed in authored runtime code.' });
          }
          for (const [key, value] of Object.entries(node)) {
            if (key === 'parent' || key === 'tokens' || key === 'comments') continue;
            if (Array.isArray(value)) value.forEach(reportDynamicMembers);
            else if (value && typeof value === 'object') reportDynamicMembers(value);
          }
        };

        visit(program);
        reportDynamicMembers(program);
      },
    };
  },
};

export const effectRestrictionRules = {
  'no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: 'react',
          importNames: forbiddenEffectNames,
          message: 'React effect APIs are not allowed in authored runtime code.',
        },
      ],
    },
  ],
  'no-restricted-properties': [
    'error',
    ...forbiddenEffectNames.map((property) => ({
      object: 'React',
      property,
      message: 'React effect APIs are not allowed in authored runtime code.',
    })),
  ],
  'no-restricted-syntax': [
    'error',
    ...forbiddenEffectNames.flatMap((name) => [
      {
        selector: `CallExpression[callee.type="Identifier"][callee.name="${name}"]`,
        message: 'React effect APIs are not allowed in authored runtime code.',
      },
      {
        selector: `MemberExpression[property.name="${name}"]`,
        message: 'React effect APIs are not allowed in authored runtime code.',
      },
      {
        selector: `Property[key.name="${name}"]`,
        message: 'React effect APIs are not allowed in authored runtime code.',
      },
    ]),
    {
      selector: 'ImportExpression[source.value="react"]',
      message: 'Dynamic React imports are not allowed in authored runtime code.',
    },
    {
      selector: 'Property[computed=true]',
      message: 'Computed destructuring is not allowed in authored runtime code.',
    },
  ],
};

export const effectRestrictionConfig = {
  files: ['src/**/*.{js,jsx,ts,tsx}'],
  languageOptions: { parser: tseslint.parser },
  plugins: { 'portfolio-restrictions': { rules: { 'no-dynamic-react-member': noDynamicReactMember } } },
  rules: {
    ...effectRestrictionRules,
    'portfolio-restrictions/no-dynamic-react-member': 'error',
  },
};

export default tseslint.config(
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  effectRestrictionConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/no-unknown-property': ['error', { ignore: ['class'] }],
    },
  },
);
