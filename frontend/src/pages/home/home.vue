<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';

import { Result } from '../../common/types/result';

const router = useRouter();

const state = ref<'LOADING' | 'LOADED'>('LOADING');

// `/wiki/home` があれば本ページは表示しない
onMounted(async () => {
  try {
    state.value = 'LOADING';
    
    const response = await fetch('/api/documents/home', { method: 'GET' });
    const json: Result<Document> = await response.json();
    if(json.error != null) {
      if(json.code === 404) {
        console.log('Home Document Does Not Exist. Show Default Home Page', json);
      }
      else {
        console.warn('Failed To Fetch Home Document. Show Default Home Page Instead', json);
      }
      state.value = 'LOADED';
      return;
    }
    
    console.log('Home Document Fetched', json);
    router.push('/wiki/home');
  }
  catch(error) {
    console.warn('Fetch Home Document : Unknown Error. Show Default Home Page Instead', error);
    state.value = 'LOADED';
    return;
  }
});
</script>

<template>
  <template v-if="state === 'LOADED'">
    <h1>Miki.js</h1>
    <p>Miki.js にようこそ！ Miki.js は以下の特徴を持つ Wiki ソフトウェアです。</p>
    <ul>
      <li>Markdown 形式で Wiki を執筆できる</li>
      <li>
        Misskey の認証機能でアカウントを作成・パスワードレスログインできる
        <ul>
          <li>ログインを許可する Misskey サーバは管理者が設定可能</li>
        </ul>
      </li>
    </ul>
    <p>あなたも Miki.js で執筆してみませんか？ トップメニューの「アカウント」アイコンより、アカウントを登録して開始しましょう！</p>
  </template>
</template>

<style scoped>
ul {
  padding-left: 1.85rem;
}

ul ul {
  margin: 0;
}
</style>
