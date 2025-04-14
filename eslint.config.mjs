import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default defineConfig([
  // 기본 자바스크립트 설정
  js.configs.recommended,

  // 글로벌 환경 설정
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
  },

  // 공통 설정
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          pathGroups: [
            { pattern: '@src/**', group: 'internal' },
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'next/**', group: 'external', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index'],
        },
      ],
      'import/prefer-default-export': 'off',
      'import/extensions': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-alert': 'off',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['event', 'ctx', 'state', 'acc'],
        },
      ],
    },
  },

  // TypeScript 설정
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-interface': ['warn', { allowSingleExtends: true }],
    },
  },

  // React 설정
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/display-name': 'off',
      'react/self-closing-comp': 'warn',
      'react/no-children-prop': 'off',
      'react/react-in-jsx-scope': 'off',

      // React 관련 추가 규칙
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
      'react/function-component-definition': ['error', { namedComponents: ['arrow-function'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/no-danger': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'react/prop-types': 'off',
      'react/require-default-props': 'off',

      // jsx-a11y 규칙
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // React Hooks 설정
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'error',
        {
          additionalHooks: '(useRecoilCallback|useBackKey)',
        },
      ],
    },
  },

  // Next.js 설정
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },

  // Prettier 설정
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
    },
  },

  // 그 외 공통 규칙
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'arrow-body-style': 'warn',
    },
  },

  // 무시할 파일 설정
  {
    ignores: ['**/node_modules/**', '**/out/**', '**/.next/**'],
  },
]);
