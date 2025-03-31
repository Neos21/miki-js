<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

import { useUserStore } from '../../shared/stores/use-user-store';
import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { onMounted, ref, watch } from 'vue';
import { isEmptyString } from '../../common/helpers/is-empty-string';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();

const currentWikiPath = ref<string | null>(null);

const onClick = (): void => {
  if(!isEmptyString(currentWikiPath.value)) router.push(`/edit/${currentWikiPath.value}`);
};

const watchCurrentWikiPath = (): void => {
  const currentPath = route.path;
  if(currentPath.startsWith('/wiki/')) {
    currentWikiPath.value = currentPath.replace(/^\/wiki\//, '');
  }
  else {
    // Wiki ページ以外にいる場合は空値にし、ボタンを表示させない
    currentWikiPath.value = null;
  }
};

onMounted(watchCurrentWikiPath);
watch(() => route.path, watchCurrentWikiPath);
</script>

<template>
  <v-tooltip v-if="!isEmptyObject(userStore.user) && !isEmptyString(currentWikiPath)" text="編集" location="bottom">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-note-edit-outline" @click="onClick"></v-btn>
    </template>
  </v-tooltip>
</template>
