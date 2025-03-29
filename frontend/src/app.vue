<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar>Miki.js</v-app-bar>
    
    <v-navigation-drawer>
      <v-list>
        <v-list-item>Miki.js</v-list-item>
        <v-list-item><v-icon icon="mdi-home" /><RouterLink to="/">Home</RouterLink></v-list-item>
        <v-list-item><v-icon icon="mdi-account-cog" /><RouterLink to="/admin">Admin</RouterLink></v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>
