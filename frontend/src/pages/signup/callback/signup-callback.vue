<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { isEmptyString } from '../../../common/helpers/is-empty-string';
import { Result } from '../../../common/types/result';
import { User } from '../../../common/types/user';
import { passwordRules } from '../../../shared/helpers/validator-user-password-rules';
import { useUserStore } from '../../../shared/stores/use-user-store';
import { Signup } from '../../../shared/types/signup';

const route  = useRoute();
const router = useRouter();

const userStore = useUserStore();

const state       = ref<'LOADING' | 'SUCCEEDED' | 'FAILED'>('LOADING');
const sessionId   = ref<string | null>(null);
const signup      = ref<Signup | null>(null);
const misskeyUser = ref<{[key: string]: any} | null>(null);
const isValid     = ref<boolean>(false);
const password    = ref<string>('');

const createOrUpdateUser = async (inputPassword?: string): Promise<void> => {
  try {
    const user: User = {
      id                 : `@${misskeyUser.value!.user.username}@${signup.value!.misskeyHost}`,
      misskeyUserName    : misskeyUser.value!.user.username,
      misskeyHost        : signup.value!.misskeyHost,
      misskeyHostProtocol: signup.value!.misskeyHostProtocol,
      name               : misskeyUser.value!.user.username,
      avatarUrl          : misskeyUser.value!.user.avatarUrl,
      sessionId          : sessionId.value!,
      token              : misskeyUser.value!.token,
      misskeyUser        : misskeyUser.value!.user
    };
    
    // 生データをココに持たせておきバックエンドでハッシュ化する
    if(!isEmptyString(inputPassword)) user.passwordHash = inputPassword;
    
    const response = await fetch('/api/users', {  // バックエンドでは Insert ではなく Save で保存している
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const json = await response.json();
    console.log('User Created Or Updated', json);
    
    userStore.setUser(user);
    router.push('/');
  }
  catch(error) {
    console.error('Failed To Create Or Update User', error);  // TODO : エラー表示
  }
};

const onSubmit = async (): Promise<void> => {
  await createOrUpdateUser(password.value);
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
      console.error('Something Wrong With Check MiAuth', json);
      return null;
    }
    return json;
  }
  catch(error) {
    console.error('Failed To Check MiAuth', error);
    return null;
  }
};

const fetchUser = async (userName: string, misskeyHost: string): Promise<User | null> => {
  try {
    const id = `@${userName}@${misskeyHost}`;
    const response = await fetch(`/api/users/${id}`, { method: 'GET' });
    const json: Result<User> = await response.json();
    if(json.error != null) {
      console.log('Maybe User Not Found', json);
      return null;
    }
    console.log('The User Is Already Registered', json);
    return json.result;
  }
  catch(error) {
    console.error('Failed To Fetch User', error);
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
  
  // ココまででユーザ登録に使用するデータが出揃ったので控えておく
  sessionId.value   = querySessionId;
  signup.value      = loadedSignup;
  misskeyUser.value = fetchedMisskeyUser;
  
  const fetchedUser = await fetchUser(fetchedMisskeyUser.user.username, loadedSignup.misskeyHost);
  if(fetchedUser != null) {
    // アカウント作成済みの人が再度 MiAuth を通った場合 : パスワード入力はスキップして DB を上書きしログインさせる
    console.log('The User Is Already Registered. Update The User', fetchedUser);
    return await createOrUpdateUser();
  }
  
  // パスワード入力欄を表示する
  state.value = 'SUCCEEDED';
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
      <p>ユーザ ID : @{{ misskeyUser!.user.username }}@{{ signup?.misskeyHost }}</p>
      <p><v-text-field v-model="password" :rules="passwordRules" label="パスワード" required /></p>
      <p><v-btn :disabled="!isValid" @click="onSubmit">登録</v-btn></p>
    </v-form>
  </template>
  <template v-else-if="state === 'FAILED'">
    <p class="text-error">MiAuth 認証処理に失敗しました。もう一度「アカウント登録」画面からやり直してください。</p>
    <p><v-btn to="/signup">「アカウント登録」画面へ</v-btn></p>
  </template>
</template>
