<script setup lang="ts">
import { onMounted, ref } from 'vue';

import * as bcryptjs from 'bcryptjs';
import { useRoute, useRouter } from 'vue-router';

import { isEmptyString } from '../../../common/helpers/is-empty-string';
import { User } from '../../../common/types/user';
import { passwordRules } from '../../../shared/helpers/validator-user-password-rules';
import { useUserStore } from '../../../shared/stores/use-user-store';
import { Signup } from '../../../shared/types/signup';

const router = useRouter();
const route = useRoute();

const state = ref<'LOADING' | 'SUCCEEDED' | 'FAILED'>('LOADING');

const sessionId   = ref<string | null>(null);
const signup      = ref<Signup | null>(null);
const misskeyUser = ref<{[key: string]: any} | null>(null);

const isValid  = ref<boolean>(false);
const password = ref<string>('');

const userStore = useUserStore();

const onSubmit = async (): Promise<void> => {
  try {
    const salt = await bcryptjs.genSalt(10);  // TODO : やっぱやめる・バックエンドでやろう
    const passwordHash = await bcryptjs.hash(password.value, salt);
    
    const user: User = {
      id                 : `@${misskeyUser.value!.user.username}@${signup.value!.misskeyHost}`,
      misskeyUserName    : misskeyUser.value!.user.username,
      misskeyHost        : signup.value!.misskeyHost,
      misskeyHostProtocol: signup.value!.misskeyHostProtocol,
      passwordHash       : passwordHash,
      name               : misskeyUser.value!.user.username,
      avatarUrl          : misskeyUser.value!.user.avatarUrl,
      sessionId          : sessionId.value!,
      token              : misskeyUser.value!.token,
      misskeyUser        : misskeyUser.value!.user
    };
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const json = await response.json();
    console.log('User Created', json);
    
    userStore.setUser(user);
    router.push('/');
  }
  catch(error) {
    console.error('Failed To Create User', error);  // TODO : エラー表示
  }
};

const getSignup = (): Signup | null => {
  try {
    const rawSignup = window.localStorage.getItem('signup');
    if(rawSignup == null) {
      console.error('LocalStorage Signup Is Empty');
      return null;
    };
    const parsedSignup = JSON.parse(rawSignup);
    return parsedSignup;
  }
  catch(error) {
    console.error('Failed To Get Signup', error);
    return null;
  }
};

const fetchMisskeyUser = async (misskeyHostProtocol: string, misskeyHost: string, sessionId: string): Promise<{[key: string]: any} | null> => {
  try {
    const response = await fetch(`${misskeyHostProtocol}${misskeyHost}/api/miauth/${sessionId}/check`, { method: 'POST' });
    const json = await response.json();
    if(!json.ok) {
      console.warn('Something Wrong With Check MiAuth', json);
      return null;
    }
    return json;
  }
  catch(error) {
    console.error('Failed To Check MiAuth', error);
    return null;
  }
};

onMounted(async () => {
  await router.isReady();
  const querySessionId = route.query.session as string;
  if(isEmptyString(querySessionId)) {
    console.error('Missing Session ID', route.query);
    state.value = 'FAILED';
    return;
  }
  
  const loadedSignup = getSignup();
  if(loadedSignup == null) {
    console.error('Failed To Get Signup From LocalStorage');
    state.value = 'FAILED';
    return;
  }
  if(querySessionId !== loadedSignup.sessionId) {
    console.error('Invalid Session ID', querySessionId, signup);
    state.value = 'FAILED';
    return;
  }
  
  const fetchedMisskeyUser = await fetchMisskeyUser(loadedSignup.misskeyHostProtocol, loadedSignup.misskeyHost, querySessionId);
  if(fetchedMisskeyUser == null) {
    console.error('Failed To Fetch Misskey User');
    state.value = 'FAILED';
    return;
  }
  
  // TODO : アカウント作成済みの人が再度 MiAuth を通った場合を考慮して、ココで DB にユーザ情報が存在するかチェックする・存在すれば一部上書きして更新・ログインさせる
  
  sessionId.value   = querySessionId;
  signup.value      = loadedSignup;
  misskeyUser.value = fetchedMisskeyUser;
  state.value       = 'SUCCEEDED';
});
</script>

<template>
  <h1>パスワード登録</h1>
  <template v-if="state === 'LOADING'">
    <p class="text-grey">Loading...</p>
  </template>
  <template v-else-if="state === 'SUCCEEDED'">
    <p>MiAuth でアカウント情報が取得できました。次回ログイン用にパスワードを作成してください。</p>
    <v-form v-model="isValid">
      <p><v-text-field v-model="password" :rules="passwordRules" label="パスワード" required /></p>
      <p><v-btn :disabled="!isValid" @click="onSubmit">登録</v-btn></p>
    </v-form>
  </template>
  <template v-else-if="state === 'FAILED'">
    <p class="text-error">MiAuth 認証処理に失敗しました。もう一度「アカウント登録」画面からやり直してください。</p>
    <p><v-btn to="/signup">「アカウント登録」画面へ</v-btn></p>
  </template>
</template>
