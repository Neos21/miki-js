<script setup lang="ts">
import AppBarAvatar from './core/components/app-bar-avatar.vue';
</script>

<template>
  <v-app>
    <v-app-bar :elevation="0" color="black">
      <template v-slot:prepend>
        <v-img src="/logo.png" width="34" height="34" class="ml-3" />
      </template>
      <v-app-bar-title>Miki.js</v-app-bar-title>
      <template v-slot:append>
        <AppBarAvatar />
      </template>
    </v-app-bar>
    
    <!-- permanent で表示したままになる -->
    <v-navigation-drawer permanent color="primary">
      <v-container class="bg-blue-darken-3 text-center">
        <v-btn link to="/" flat prepend-icon="mdi-home" class="text-none">Home</v-btn>
      </v-container>
      <v-list density="compact">
        <v-list-item prepend-icon="mdi-account-cog" link to="/admin">Admin</v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main height="100vh">
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
