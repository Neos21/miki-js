<script setup lang="ts">
import { onMounted } from 'vue';

import { useRouter } from 'vue-router';

import { isEmptyObject } from '../../../common/helpers/is-empty-object';
import { Result } from '../../../common/types/result';
import { User } from '../../../common/types/user';
import { useUserStore } from '../../../shared/stores/use-user-store';

const router = useRouter();

const userStore = useUserStore();

onMounted(async () => {
  // LocalStorage からユーザ情報が復旧できたらログイン済とみなしてトップに遷移させる
  if(!isEmptyObject(userStore.getUser())) return router.push('/');
  
  try {
    const storedMisskeyLogin = window.localStorage.getItem('misskey-login');
    if(storedMisskeyLogin == null) return console.error('Failed To Get Misskey Login From LocalStorage');  // TODO : エラー表示
    
    const { misskeyHost, token } = JSON.parse(storedMisskeyLogin);
    const response = await fetch('/api/auth/misskey-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ misskeyHost, token })
    });
    const json: Result<User> = await response.json();
    if(json.error != null) return console.error('Something Wrong', json);  // TODO : エラー表示
    
    userStore.setUser(json.result);
    console.log('User Stored', json);
  }
  catch(error) {
    console.error('Failed To Misskey Callback', error);
  }
  finally {
    router.push('/');
  }
});
</script>

<template>
  <p class="text-grey">Loading...</p>
</template>
