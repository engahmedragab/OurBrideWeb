import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.next', 'out'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettier,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Specific rules for app directory pages to catch Turbopack issues
  {
    files: ['src/app/**/page.tsx', 'src/app/**/page.ts'],
    rules: {
      // Warn about useParams in pages (should use params prop for server components)
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'next/navigation',
              importNames: ['useParams'],
              message:
                '⚠️ Turbopack: Use params prop instead of useParams() in pages with generateStaticParams. This causes conflicts between client and server components.',
            },
          ],
        },
      ],
      // Detect pages with children prop (invalid for page components)
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "FunctionDeclaration[params.0.type='ObjectPattern'] > ObjectPattern > Property[key.name='children']",
          message:
            '❌ Page components cannot accept "children" prop. Use layout components for children.',
        },
      ],
    },
  },
  // Rules for index.ts files that might have re-export issues with Turbopack
  {
    files: ['**/index.ts', '**/index.tsx'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['./calendar/*', './components/*'],
              message:
                '⚠️ Turbopack: Ensure all re-exported files exist and have correct extensions. Check module resolution.',
            },
          ],
        },
      ],
    },
  }
)
