<script setup lang="ts">
import { useTreeStore } from '../../shared/stores/use-tree-store';
import DocumentTreeNestedList from './document-tree-nested-list.vue';

const treeStore = useTreeStore();

(async () => {
  await treeStore.fetchRootTree();
})();
</script>

<template>
  <v-list density="compact">
    <DocumentTreeNestedList :tree="treeStore.tree" :isRoot="true" parentUriPath="/wiki" />
  </v-list>
</template>
