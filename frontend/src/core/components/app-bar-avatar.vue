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
    if(json.error != null) {
      console.error('Failed To Fetch User', json);
      return;
    }
    
    userStore.setUser(json.result);
    console.log('User Fetched', json);
  }
  catch(error) {
    console.error('Fetch User : Unknown Error', error);
  }
});
</script>

<template>
  <v-tooltip text="アカウント" location="start">
    <template #activator="{ props }">
      <v-btn v-if="isEmptyObject(userStore.user)" icon v-bind="props" to="/auth">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-btn v-else icon v-bind="props" to="/user-preferences">
        <v-img :src="userStore.user.avatarUrl" width="24" height="24" rounded="circle" />
      </v-btn>
    </template>
  </v-tooltip>
</template>
