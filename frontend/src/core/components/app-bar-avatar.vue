<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { v4 } from 'uuid';

import { useUserStore } from '../../shared/stores/use-user-store';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const misskeyHostUrl = 'https://misskey.neos21.net';  // TODO : バックエンドからもらうようにする

const onLogin = (): void => {
  const sessionId = v4();  // 古いモノを使い回すとユーザ情報が取得できないので毎回生成する
  const params = new URLSearchParams({
    name: 'Miki.js',
    callback: window.location.href,  // コールバック URL
    permission: 'read:account'
  });
  const url = `${misskeyHostUrl}/miauth/${sessionId}?${params.toString()}`;
  window.location.href = url;
};

(async () => {
  // コールバック URL として初期表示された時はユーザ情報を取得し保管する
  await router.isReady();
  if(route.query.session != null) {
    const sessionId = route.query.session as string;
    const response = await fetch(`${misskeyHostUrl}/api/miauth/${sessionId}/check`, { method: 'POST' });  // Throws
    const json = await response.json();  // Throws
    if(json.ok) {
      userStore.setSessionId(sessionId);
      userStore.setToken(json.token);
      userStore.setUser(json.user);
      // TODO : LocalStorage の寿命で MiAuth を多用するとアクセストークンが大量発行されてしまうので DB にユーザ情報を持つ必要がある
    }
  }
})();
</script>

<template>
  <v-tooltip v-if="userStore.user != null && Object.keys(userStore.user).length !== 0" text="Preferences" location="start">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" link to="/user-preferences">
        <v-img :src="userStore.user.avatarUrl" width="24" height="24" rounded="circle" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip v-else text="Login" location="start">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" @click="onLogin">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>
