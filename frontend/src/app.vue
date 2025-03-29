<script setup lang="ts">


</script>

<template>
  <v-app>
    <v-app-bar :elevation="0" color="black">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Miki.js</v-app-bar-title>
      <template v-slot:append>
        <v-btn>Sign-In</v-btn>
      </template>
    </v-app-bar>
    
    <!-- permanent で表示したままになる -->
    <v-navigation-drawer permanent color="blue-darken-2">
      <v-list density="compact">
        <v-list-item prepend-icon="mdi-home"        link to="/"     >Home</v-list-item>
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
