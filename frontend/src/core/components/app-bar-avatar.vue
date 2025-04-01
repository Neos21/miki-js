<script setup lang="ts">
import { onMounted } from 'vue';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { useUserStore } from '../../shared/stores/use-user-store';
import { useInitUser } from '../hooks/use-init-user';

const userStore = useUserStore();
const { fetchUser } = useInitUser();

onMounted(async () => {
  // LocalStorage・Store からユーザ情報を復元でき API で最新版を取れればログイン済にする
  await fetchUser();
});
</script>

<template>
  <v-tooltip v-if="!isEmptyObject(userStore.user)" text="アカウント" location="start">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" link to="/user-preferences">
        <v-img :src="userStore.user.avatarUrl" width="24" height="24" rounded="circle" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip v-else text="アカウント登録" location="start">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" to="/signup">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>
