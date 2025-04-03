<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { MisskeyServer } from '../../common/types/misskey-server';
import { Result } from '../../common/types/result';
import { useUserStore } from '../../shared/stores/use-user-store';

const router = useRouter();

const userStore = useUserStore();

const misskeyHosts        = ref<Array<string>>([]);
const selectedMisskeyHost = ref<string | null>(null);

const onSubmit = async (): Promise<void> => {
  try {
    const origin = window.location.origin;
    const misskeyHost = selectedMisskeyHost.value;
    const response = await fetch('/api/auth/misskey-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ misskeyHost, origin })
    });
    const json: Result<{ token: string, url: string }> = await response.json();
    if(json.error != null) return console.error('Something Wrong', json);  // TODO : エラー表示
    
    // 取得した情報を一旦 LocalStorage に入れておく
    const { token, url } = json.result;
    window.localStorage.setItem('misskey-login', JSON.stringify({ misskeyHost, token }));
    
    // 認証用 URL にリダイレクトする
    console.log(`Start Redirect To ${url}`);
    window.location.href = url;
  }
  catch(error) {
    console.error('Failed To Misskey Login', error);  // TODO : エラー表示
  }
};

onMounted(async () => {
  // LocalStorage からユーザ情報が復旧できたらログイン済とみなしてトップに遷移させる
  if(!isEmptyObject(userStore.getUser())) return router.push('/');
  
  try {
    const response = await fetch('/api/misskey-servers', { method: 'GET' });
    const json: Result<Array<MisskeyServer>> = await response.json();
    if(json.error != null) return console.error('Something Wrong', json);
    
    misskeyHosts.value = json.result.map(misskeyServer => misskeyServer.host!);
    if(json.result.length === 1) selectedMisskeyHost.value = misskeyHosts.value[0];  // 1つしかなければ初期選択しておく
  }
  catch(error) {
    console.error('Failed To Fetch Misskey Servers', error);
  }
});
</script>

<template>
  <h1>ログイン</h1>
  <p>ログインに使用する Misskey サーバを選択してください。</p>
  <p><v-select v-model="selectedMisskeyHost" :items="misskeyHosts" label="ホスト名" :disabled="misskeyHosts.length === 0" /></p>
  <p><v-btn :disabled="misskeyHosts.length === 0 || selectedMisskeyHost == null" @click="onSubmit">ログイン</v-btn></p>
</template>
