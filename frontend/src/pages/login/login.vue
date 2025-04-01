<script setup lang="ts">
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import { passwordRules } from '../../shared/helpers/validator-user-password-rules';
import { useUserStore } from '../../shared/stores/use-user-store';

const router = useRouter();

const isValid  = ref<boolean>(false);
const password = ref<string>('');

const userStore = useUserStore();

const onSubmit = async (): Promise<void> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})  // TODO
    });
    const json = await response.json();
    console.log('User Created', json);
    
    userStore.setUser(json.result);
    router.push('/');
  }
  catch(error) {
    console.error('Failed To Login', error);  // TODO : エラー表示
  }
};
</script>

<template>
  <h1>ログイン</h1>
  <v-form v-model="isValid">
    <!-- TODO : ユーザ名 -->
    <!-- TODO : サーバ一覧 -->
    <p><v-text-field v-model="password" :rules="passwordRules" label="パスワード" required /></p>
    <p><v-btn :disabled="!isValid" @click="onSubmit">ログイン</v-btn></p>
  </v-form>
</template>
