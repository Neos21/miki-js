<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { isEmptyString } from '../../common/helpers/is-empty-string';
import { useUserStore } from '../../shared/stores/use-user-store';

const route  = useRoute();
const router = useRouter();

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
      <v-btn v-bind="props" icon="mdi-note-edit-outline" @click="onClick" />
    </template>
  </v-tooltip>
</template>
