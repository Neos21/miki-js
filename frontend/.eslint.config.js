import globals from 'globals';  // グローバル変数定義
import eslintJs from '@eslint/js';  // ESLint デフォルトの JS ルールセット
import typeScriptEslint from 'typescript-eslint';  // TypeScript で ESLint と Prettier を有効にする https://typescript-eslint.io/
import eslintPluginVue from 'eslint-plugin-vue';  // Vue ファイル用のプラグイン
import eslintConfigPrettier from 'eslint-config-prettier';  // ESLint と競合する Prettier のルールを除外する

// https://eslint.vuejs.org/user-guide/
export default typeScriptEslint.config([
  { ignores: ['**/dist'] },
  {
    extends: [
      eslintJs.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      'no-trailing-spaces': 'off'  // 空行のインデントスペースを許可する
    },
  },
  eslintConfigPrettier
]);
