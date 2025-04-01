<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useDisplay } from 'vuetify';

import AppBarAvatar from './core/components/app-bar-avatar.vue';
import AppBarEditButton from './core/components/app-bar-edit-button.vue';
import AppBarNewButton from './core/components/app-bar-new-button.vue';
import DocumentTree from './core/components/document-tree.vue';

const display = useDisplay();

const isDrawerOpened = ref<boolean>(false);

onMounted(() => {
  if(display.xs) isDrawerOpened.value = true;  // 画面幅が広い時は表示する
});
</script>

<template>
  <v-app>
    <v-app-bar :elevation="0" color="black">
      <template #prepend>
        <RouterLink to="/"><v-img src="/logo.png" width="34" height="34" class="ml-3" /></RouterLink>
        <v-app-bar-nav-icon v-if="$vuetify.display.xs" class="ml-3" @click.stop="isDrawerOpened = !isDrawerOpened" />
      </template>
      <v-app-bar-title :class="$vuetify.display.xs ? 'app-bar-title' : ''"><RouterLink to="/" class="app-bar-title-text">Miki.js</RouterLink></v-app-bar-title>
      <template #append>
        <AppBarEditButton />
        <AppBarNewButton />
        <AppBarAvatar />
      </template>
    </v-app-bar>
    
    <v-navigation-drawer v-model="isDrawerOpened" color="primary" :permanent="!$vuetify.display.xs">
      <v-container class="bg-blue-darken-3 text-center">
        <v-btn link to="/" flat prepend-icon="mdi-home" class="text-none">Home</v-btn>
      </v-container>
      
      <DocumentTree />
      
      <v-list density="compact">
        <v-list-item prepend-icon="mdi-plus-thick" link to="/new">ドキュメントを作成</v-list-item>
      </v-list>
      
      <p class="text-center mt-10" style="opacity: .8;">
        <v-tooltip text="管理用エリア" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-account-cog" size="x-small" color="grey-darken-1" to="/admin" />
          </template>
        </v-tooltip>
      </p>
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

.app-bar-title-text {
  color: inherit;
  text-decoration: none;
}

.main {
  height: 100%;
  padding: 16px;
}

.main > :first-child {
  margin-top: 0;
}
</style>
