<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <h1>Wiki Page</h1>
  <p>Current Path : /{{ route.params.catchAll }}</p>
</template>
