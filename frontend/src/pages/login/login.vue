<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { isEmptyString } from '../../common/helpers/is-empty-string';
import { MisskeyHost } from '../../common/types/misskey-host';
import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';
import { passwordRules } from '../../shared/helpers/validator-user-password-rules';
import { useUserStore } from '../../shared/stores/use-user-store';

const router = useRouter();

const userStore = useUserStore();

const isValid                 = ref<boolean>(false);
const misskeyHostNames        = ref<Array<string>>([]);
const selectedMisskeyHostName = ref<string | null>(null);
const misskeyUserName         = ref<string>('');
const password                = ref<string>('');

const userNameRules = [
  (value: string): boolean | string => {
    if(isEmptyString(value)) return '空値にはできません';
    return true;
  }
];

const onSubmit = async (): Promise<void> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        misskeyUserName: misskeyUserName.value,
        misskeyHost    : selectedMisskeyHostName.value,
        password       : password.value
      })
    });
    const json: Result<User> = await response.json();
    if(json.error != null) return console.error('Something Wrong', json);  // TODO : エラー表示
    console.log('Login Succeeded', json);
    
    userStore.setUser(json.result);
    router.push('/');
  }
  catch(error) {
    console.error('Failed To Login', error);  // TODO : エラー表示
  }
};

onMounted(async () => {
  try {
    // LocalStorage から情報が復旧できたらログイン済と見なしてトップに遷移させる
    if(!isEmptyObject(userStore.getUser())) return router.push('/');
    
    const response = await fetch('/api/misskey-hosts', { method: 'GET' });
    const json: Result<Array<MisskeyHost>> = await response.json();
    if(json.error != null) return console.error('Something Wrong', json);  // TODO : エラー表示
    
    misskeyHostNames.value = json.result.map(misskeyHost => misskeyHost.host!);
    if(json.result.length === 1) selectedMisskeyHostName.value = misskeyHostNames.value[0];  // 1つしかなければ初期選択しておく
  }
  catch(error) {
    console.error('Failed To Fetch Misskey Hosts', error);  // TODO : エラー表示
  }
});
</script>

<template>
  <h1>ログイン</h1>
  <v-form v-model="isValid" class="mt-5">
    <div class="form-row">
      <v-text-field v-model="misskeyUserName" :rules="userNameRules" label="ユーザ名" required density="compact" />
      <v-select v-model="selectedMisskeyHostName" :items="misskeyHostNames" label="Misskey サーバ URL" density="compact" :disabled="misskeyHostNames.length === 0" />
    </div>
    <div><v-text-field v-model="password" :rules="passwordRules" label="パスワード" required density="compact" /></div>
    <p><v-btn :disabled="!isValid || misskeyHostNames.length === 0" @click="onSubmit">ログイン</v-btn></p>
  </v-form>
  <hr>
  <p>アカウント未登録の方は「アカウント登録」画面より登録してください。</p>
  <p><v-btn color="success" to="/signup">「アカウント登録」画面へ</v-btn></p>
</template>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: .5rem;
}
</style>
