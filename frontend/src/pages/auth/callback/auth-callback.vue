<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';

import { isEmptyObject } from '../../../common/helpers/is-empty-object';
import { isEmptyString } from '../../../common/helpers/is-empty-string';
import { Result } from '../../../common/types/result';
import { User } from '../../../common/types/user';
import { useUserStore } from '../../../shared/stores/use-user-store';

const router = useRouter();

const userStore = useUserStore();

const errorMessage = ref<string>('');

onMounted(async () => {
  // LocalStorage からユーザ情報が復旧できたらログイン済とみなしてトップに遷移させる
  if(!isEmptyObject(userStore.getUser())) return router.push('/');
  
  try {
    const storedMisskeyLogin = window.localStorage.getItem('misskey-login');
    if(storedMisskeyLogin == null) {
      console.error('Failed To Get Misskey Login From LocalStorage');
      errorMessage.value = 'Misskey Login 情報を LocalStorage から取得できませんでした。もう一度ログインをやり直してください';
      return;
    }
    
    const { misskeyHost, token } = JSON.parse(storedMisskeyLogin);
    const response = await fetch('/api/auth/misskey-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ misskeyHost, token })
    });
    const json: Result<User> = await response.json();
    if(json.error != null) {
      console.error('Failed To Misskey Callback', json);
      errorMessage.value = `Misskey 認証後のログイン処理に失敗しました : ${json.code} ${json.error}`;
      window.localStorage.removeItem('misskey-login');
      return;
    }
    
    userStore.setUser(json.result);
    console.log('User Stored', json);
    router.push('/');
  }
  catch(error: any) {
    console.error('Misskey Callback : Unknown Error', error);
    errorMessage.value = `Misskey 認証後のログイン処理に失敗しました : ${error.toString()}`;
  }
  finally {
    // 成否に関わらず消す
    window.localStorage.removeItem('misskey-login');
  }
});
</script>

<template>
  <p v-if="isEmptyString(errorMessage)" class="text-grey">Loading...</p>
  <v-alert v-if="!isEmptyString(errorMessage)" type="error" density="compact" :text="errorMessage" />
</template>
