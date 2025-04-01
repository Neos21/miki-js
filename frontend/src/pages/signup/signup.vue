<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { v4 } from 'uuid';
import { useRouter } from 'vue-router';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { MisskeyHost } from '../../common/types/misskey-host';
import { Result } from '../../common/types/result';
import { useUserStore } from '../../shared/stores/use-user-store';
import { Signup } from '../../shared/types/signup';

const router = useRouter();

const userStore = useUserStore();

const misskeyHosts            = ref<Array<MisskeyHost>>([]);
const misskeyHostNames        = ref<Array<string>>([]);
const selectedMisskeyHostName = ref<string | null>(null);

const onSubmit = (): void => {
  const targetMisskeyHost = misskeyHosts.value.find(misskeyHost => misskeyHost.host === selectedMisskeyHostName.value);
  if(targetMisskeyHost == null) return console.error('Something Wrong');
  
  const sessionId = v4();  // 古いモノを使い回すとユーザ情報が取得できないので毎回生成する
  
  const signup: Signup = {
    misskeyHost        : targetMisskeyHost.host!,
    misskeyHostProtocol: targetMisskeyHost.protocol!,
    sessionId          : sessionId
  };
  window.localStorage.setItem('signup', JSON.stringify(signup));
  
  const params = new URLSearchParams({
    name: 'Miki.js',
    callback: `${window.location.origin}/signup/callback`,
    permission: 'read:account'
  });
  const url = `${targetMisskeyHost.protocol}${targetMisskeyHost.host}/miauth/${sessionId}?${params.toString()}`;
  console.log(`Start Redirect To ${url}`);
  window.location.href = url;
};

onMounted(async () => {
  try {
    // LocalStorage から情報が復旧できたらログイン済と見なしてトップに遷移させる
    if(!isEmptyObject(userStore.getUser())) return router.push('/');
    
    const response = await fetch('/api/misskey-hosts', { method: 'GET' });
    const json: Result<Array<MisskeyHost>> = await response.json();
    if(json.error != null) return console.error('Something Wrong', json);
    
    misskeyHosts.value     = json.result;
    misskeyHostNames.value = json.result.map(misskeyHost => misskeyHost.host!);
    if(json.result.length === 1) selectedMisskeyHostName.value = misskeyHostNames.value[0];  // 1つしかなければ初期選択しておく
  }
  catch(error) {
    console.error('Failed To Fetch Misskey Hosts', error);
  }
});
</script>

<template>
  <h1>アカウント登録</h1>
  <p>アカウント登録に使用する Misskey サーバを選択してください。MiAuth によりアカウント情報を取得します。</p>
  <p><v-select v-model="selectedMisskeyHostName" :items="misskeyHostNames" label="Misskey サーバ URL" :disabled="misskeyHostNames.length === 0" /></p>
  <p><v-btn :disabled="misskeyHostNames.length === 0 || selectedMisskeyHostName == null" class="text-none" @click="onSubmit">MiAuth でアカウント登録</v-btn></p>
  <hr>
  <p>登録済みの方は「ログイン」画面よりログインしてください。</p>
  <p><v-btn color="success" to="/login">「ログイン」画面へ</v-btn></p>
</template>
