<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { v4 } from 'uuid';

import { useUserStore } from '../../shared/stores/use-user-store';
import { useInitUser } from '../hooks/use-init-user';
import { isEmptyObject } from '../../common/helpers/is-empty-object';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const { loadUser, createUser } = useInitUser();

const misskeyHost = 'misskey.neos21.net';  // TODO : バックエンドからもらうようにする
const misskeyHostUrl = `https://${misskeyHost}`;

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
  await router.isReady();
  if(route.query.session != null) {
    // コールバック URL として初期表示された時はユーザ情報を取得し保管する
    const sessionId = route.query.session as string;
    await createUser(misskeyHost, misskeyHostUrl, sessionId);
  }
  else {
    // LocalStorage・Store からユーザ情報を復元できればログイン済にする
    await loadUser();
  }
})();
</script>

<template>
  <v-tooltip v-if="!isEmptyObject(userStore.user)" text="Preferences" location="start">
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
