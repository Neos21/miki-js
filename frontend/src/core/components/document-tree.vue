<script setup lang="ts">
import { onMounted } from 'vue';
import { useTreeStore } from '../../shared/stores/use-tree-store';
import DocumentTreeNestedList from './document-tree-nested-list.vue';

const treeStore = useTreeStore();

onMounted(async () => {
  await treeStore.fetchRootTree();
});
</script>

<template>
  <DocumentTreeNestedList :tree="treeStore.tree" :nestLevel="0" parentUriPath="/wiki" />
  
  <!-- TODO : Debug -->
  <pre style="max-height: 500px; overflow: auto; font-size: .5rem;">{{ JSON.stringify(treeStore.tree, null, '  ') }}</pre>
</template>
