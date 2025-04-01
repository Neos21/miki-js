<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useUserStore } from '../../shared/stores/use-user-store';

const router = useRouter();

const userStore = useUserStore();

const onLogout = (): void => {
  userStore.setUser({});
  router.push('/');
};
</script>

<template>
  <h1>ユーザ設定</h1>
  <p><v-btn class="text-none" @click="onLogout">Logout</v-btn></p>
</template>
