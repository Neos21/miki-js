<script setup lang="ts">
import { onMounted } from 'vue';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';
import { useUserStore } from '../../shared/stores/use-user-store';

const userStore = useUserStore();

onMounted(async () => {
  // LocalStorage・Store からユーザ情報を復元でき API で最新版を取れればログイン済にする
  try {
    const storedUser = userStore.getUser();
    if(isEmptyObject(storedUser)) return console.log('The User Does Not Exist In The User Store (LocalStorage)');
    
    const response = await fetch(`/api/users/${storedUser.id}`, { method: 'GET' });
    const json: Result<User> = await response.json();
    if(json.error != null) return console.error('Something Wrong', json);
    userStore.setUser(json.result);
    console.log('User Fetched', json);
  }
  catch(error) {
    console.error('Failed To Fetch User', error);
  }
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
  <v-tooltip v-else text="アカウント" location="start">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" to="/login">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>
