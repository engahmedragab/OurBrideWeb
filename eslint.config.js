import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['dist', 'node_modules'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    plugins: {
      react,
    },

    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'no-console': 'warn',

      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'react/self-closing-comp': 'warn',

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
