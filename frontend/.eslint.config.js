import globals from 'globals';  // グローバル変数定義
import eslintJs from '@eslint/js';  // ESLint デフォルトの JS ルールセット
import typeScriptEslint from 'typescript-eslint';  // TypeScript で ESLint と Prettier を有効にする https://typescript-eslint.io/
import eslintPluginVue from 'eslint-plugin-vue';  // Vue ファイル用のプラグイン
import eslintPluginImport from 'eslint-plugin-import';  // Import 順を整理する (Vue SFC 対応)

// https://eslint.vuejs.org/user-guide/
export default typeScriptEslint.config([
  { ignores: ['**/dist'] },
  {
    extends: [
      eslintJs.configs.recommended,
      ...typeScriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
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
      'vue/max-attributes-per-line': 'off',  // 属性ごとに改行を強制させない
      'vue/multi-word-component-names': 'off',  // コンポーネント名が単一語でも許可する
      'vue/no-multi-spaces': 'off',  // 垂直アラインメントを許可させる
      'vue/singleline-html-element-content-newline': 'off',  // 要素の改行を強制させない
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroups: [{
          pattern: 'vue',
          group: 'external',
          position: 'before'
        }],
        pathGroupsExcludedImportTypes: ['vue']
      }]
    }
  }
]);
