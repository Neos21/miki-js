import globals from 'globals';  // グローバル変数定義
import eslintJs from '@eslint/js';  // ESLint デフォルトの JS ルールセット
import typeScriptEslint from 'typescript-eslint';  // TypeScript で ESLint を有効にする https://typescript-eslint.io/
import eslintPluginImport from 'eslint-plugin-import';  // Import 順を整理する

// https://eslint.vuejs.org/user-guide/
export default typeScriptEslint.config([
  {
    extends: [
      eslintJs.configs.recommended,
      ...typeScriptEslint.configs.recommended
    ],
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
      parserOptions: {
        parser: typeScriptEslint.parser
      }
    }
  },
  {
    plugins: {
      import: eslintPluginImport
    }
  },
  {
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],  // シングルクォートを強制する
      semi: ['error', 'always'],  // セミコロンを強制付与する
      'no-trailing-spaces': 'off',  // 空行のインデントスペースを許可する
      '@typescript-eslint/no-explicit-any': 'off',  // any を許可する
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }]
    }
  }
]);
