<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';

import AppBarAvatar from './core/components/app-bar-avatar.vue';
import DocumentTree from './core/components/document-tree.vue';

const display = useDisplay();

const isDrawerOpened = ref<boolean>(false);

onMounted(() => {
  if(display.xs) isDrawerOpened.value = true;  // 広い時は開いておく
});
</script>

<template>
  <v-app>
    <v-app-bar :elevation="0" color="black">
      <template v-slot:prepend>
        <v-img src="/logo.png" width="34" height="34" class="ml-3" />
        <v-app-bar-nav-icon class="ml-3" v-if="$vuetify.display.xs" @click.stop="isDrawerOpened = !isDrawerOpened"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title :class="$vuetify.display.xs ? 'app-bar-title' : ''">Miki.js</v-app-bar-title>
      <template v-slot:append>
        <AppBarAvatar />
      </template>
    </v-app-bar>
    
    <v-navigation-drawer color="primary" :permanent="!$vuetify.display.xs" v-model="isDrawerOpened">
      <v-container class="bg-blue-darken-3 text-center">
        <v-btn link to="/" flat prepend-icon="mdi-home" class="text-none">Home</v-btn>
      </v-container>
      
      <DocumentTree />
      
      <v-list density="compact">
        <v-list-item prepend-icon="mdi-plus-thick" link to="/new-root-document">ドキュメントを作成</v-list-item>
        <v-list-item prepend-icon="mdi-account-cog" link to="/admin">Admin</v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main height="100vh">
      <main class="main">
        <RouterView />
      </main>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-bar-title {
  margin-inline-start: 12px;
}

.main {
  height: 100%;
  padding: 16px;
}

.main > :first-child {
  margin-top: 0;
}
</style>
