<script setup lang="ts">
import { useUserStore } from '../../shared/stores/use-user-store';

const userStore = useUserStore();

const onLogout = (): void => {
  userStore.setUser({});
};
</script>

<template>
  <h1>ユーザ設定</h1>
  <v-btn class="text-none" @click="onLogout">Logout</v-btn>
</template>
