<script setup lang="ts">
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import { Result } from '../../../common/types/result';
import { useAdminStore } from '../../../shared/stores/use-admin-store';

const router = useRouter();

const adminStore = useAdminStore();

const isValid  = ref<boolean>(false);
const password = ref<string>('');

const adminPasswordRules = [
  (value: string): boolean | string => {
    if(value.trim() === '') return '空値にはできません';
    return true;
  }
];

const onSubmit = async (): Promise<void> => {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    });
    const json: Result<{ jwt: string }> = await response.json();
    if(json.error != null) return console.error('Maybe Invalid Password', json);  // TODO : エラー表示
    
    adminStore.setJwt(json.result.jwt);
    router.push('/admin/home');
  }
  catch(error) {
    console.error('Failed To Login', error);  // TODO : エラー表示
  }
};
</script>

<template>
  <h1>管理用エリアログイン</h1>
  <v-form v-model="isValid">
    <p><v-text-field v-model="password" :rules="adminPasswordRules" label="パスワード" required /></p>
    <p><v-btn :disabled="!isValid" @click="onSubmit">ログイン</v-btn></p>
  </v-form>
</template>
