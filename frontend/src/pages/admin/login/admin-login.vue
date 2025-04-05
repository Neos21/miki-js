<script setup lang="ts">
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import { isEmptyString } from '../../../common/helpers/is-empty-string';
import { Result } from '../../../common/types/result';
import { validatorRuleNoEmpty } from '../../../shared/helpers/validator-rule-no-empty';
import { useAdminStore } from '../../../shared/stores/use-admin-store';

const router = useRouter();

const adminStore = useAdminStore();

const isValid      = ref<boolean>(false);
const password     = ref<string>('');
const errorMessage = ref<string>('');

const onSubmit = async (): Promise<void> => {
  try {
    errorMessage.value = '';
    
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    });
    const json: Result<{ jwt: string }> = await response.json();
    if(json.error != null) {
      console.error('Failed To Admin Login : Maybe Invalid Password', json);
      errorMessage.value = 'ログインに失敗しました。パスワードを再確認してください';
      return;
    }
    
    adminStore.setJwt(json.result.jwt);
    router.push('/admin/home');
  }
  catch(error: any) {
    console.error('Admin Login : Unknown Error', error);
    errorMessage.value = 'ログインに失敗しました';
  }
};
</script>

<template>
  <h1>管理用エリアログイン</h1>
  <v-form v-model="isValid">
    <p><v-text-field v-model="password" :rules="[validatorRuleNoEmpty]" label="パスワード" required /></p>
    <p><v-btn :disabled="!isValid" @click="onSubmit">ログイン</v-btn></p>
  </v-form>
  <v-alert v-if="!isEmptyString(errorMessage)" type="error" density="compact" class="mt-5" :text="errorMessage" closable />
</template>
