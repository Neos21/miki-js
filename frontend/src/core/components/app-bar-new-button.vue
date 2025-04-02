<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { isEmptyString } from '../../common/helpers/is-empty-string';
import { useUserStore } from '../../shared/stores/use-user-store';

const route  = useRoute();
const router = useRouter();

const userStore = useUserStore();

const currentWikiPath = ref<string>('');

const onClick = (): void => {
  if(!isEmptyString(currentWikiPath.value)) {
    router.push(`/new/${currentWikiPath.value}`);
  }
  else {
    router.push('/new');
  }
};

const watchCurrentWikiPath = (): void => {
  const currentPath = route.path;
  if(currentPath.startsWith('/wiki/')) {
    // Wiki ページにいる時はその配下に新規ページを作れるようにする
    currentWikiPath.value = currentPath.replace(/^\/wiki\//, '');
  }
  else {
    // Wiki ページ以外はルート直下に新規ページを作れるようにする
    currentWikiPath.value = '';
  }
};

onMounted(watchCurrentWikiPath);
watch(() => route.path, watchCurrentWikiPath);
</script>

<template>
  <v-tooltip v-if="!isEmptyObject(userStore.user)" text="新規作成" location="bottom">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-note-plus-outline" @click="onClick" />
    </template>
  </v-tooltip>
</template>
