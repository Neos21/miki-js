<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';

import { isEmptyString } from '../../common/helpers/is-empty-string';
import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';
import { validatorRuleNoEmpty } from '../../shared/helpers/validator-rule-no-empty';
import { useUserStore } from '../../shared/stores/use-user-store';

const router = useRouter();

const userStore = useUserStore();

const isValid      = ref<boolean>(false);
const name         = ref<string>('');
const avatarUrl    = ref<string>('');
const errorMessage = ref<string>('');
const isSuccessful = ref<boolean>(false);  // 保存成功メッセージを一時的に表示する用

const onSave = async () => {
  try {
    errorMessage.value = '';
    isSuccessful.value = false;
    
    const userToSave = {
      name     : name.value,
      avatarUrl: avatarUrl.value
    };
    const response = await fetch(`/api/users/${userStore.user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userToSave)
    });
    const json: Result<User> = await response.json();
    if(json.error != null) {
      console.error('Failed To Save User', json);
      errorMessage.value = `保存に失敗しました : ${json.code} ${json.error}`;
      return;
    }
    
    console.log('User Saved', json);
    userStore.setUser(json.result);
    isSuccessful.value = true;
    setTimeout(() => {
      isSuccessful.value = false;
    }, 3000);
  }
  catch(error: any) {
    console.error('Save User : Unknown Error', error);
    errorMessage.value = `保存に失敗しました : ${error.toString()}`;
  }
};

const onRemove = async () => {
  try {
    errorMessage.value = '';
    
    // TODO : この API エンドポイントを知られてしまうと他人のアカウントも消せてしまう・ログイン時に JWT 発行が必要
    const response = await fetch(`/api/users/${userStore.user.id}`, { method: 'DELETE' });
    const json: Result<User> = await response.json();
    if(json.error != null) {
      console.error('Failed To Remove User', json);
      errorMessage.value = `アカウント削除に失敗しました : ${json.code} ${json.error}`;
      return;
    }
    
    console.log('User Removed', json);
    onLogout();
  }
  catch(error: any) {
    console.error('Remove User : Unknown Error', error);
    errorMessage.value = `アカウント削除に失敗しました : ${error.toString()}`;
  }
};

const onLogout = (): void => {
  userStore.setUser({});
  router.push('/');
};

onMounted(async () => {
  try {
    const response = await fetch(`/api/users/${userStore.user.id}`, { method: 'GET' });
    const json: Result<User> = await response.json();
    if(json.error != null) {
      console.error('Failed To Fetch User', json);
      return onLogout();
    }
    
    userStore.setUser(json.result);
    name.value      = userStore.user.name!;
    avatarUrl.value = userStore.user.avatarUrl ?? '';
  }
  catch(error) {
    console.error('Fetch User : Unknown Error', error);
    onLogout();
  }
});
</script>

<template>
  <h1>ユーザ設定</h1>
  
  <v-form v-model="isValid">
    <dl>
      <dt>ユーザ ID (Misskey ユーザ ID と Misskey ホスト名の組み合わせ・変更不可)</dt>
      <dd>
        <p>{{ userStore.user.id }}</p>
      </dd>
      <dt>ユーザ表示名</dt>
      <dd>
        <p><v-text-field v-model="name" :rules="[validatorRuleNoEmpty]" label="ユーザ表示名" required density="compact" /></p>
      </dd>
      <dt>アバター画像 URL</dt>
      <dd>
        <p><v-text-field v-model="avatarUrl" label="アバター画像 URL" density="compact" /></p>
      </dd>
    </dl>
    <p class="text-right"><v-btn :disabled="!isValid" @click="onSave">保存</v-btn></p>
  </v-form>
  <v-alert v-if="isSuccessful" type="success" density="compact" class="mt-5" text="保存されました" />
  <v-alert v-if="!isEmptyString(errorMessage)" type="error" density="compact" class="mt-5" :text="errorMessage" closable />
  
  <hr>
  
  <h2>ログアウト</h2>
  <p class="text-right"><v-btn class="text-none" @click="onLogout">Logout</v-btn></p>
  
  <hr>
  
  <h2>アカウント削除</h2>
  <p class="font-weight-bold text-error">以下のボタンを押すとアカウントが削除されます。確認ダイアログは出ないのでご注意ください。</p>
  <p>(同じアカウントでの再登録は可能です)</p>
  <p class="text-right"><v-btn color="error" @click="onRemove">アカウント削除</v-btn></p>
</template>
