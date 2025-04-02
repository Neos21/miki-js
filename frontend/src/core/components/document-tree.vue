<script setup lang="ts">
import { onMounted } from 'vue';

import { Result } from '../../common/types/result';
import { TreeItem } from '../../common/types/tree-item';
import { useTreeStore } from '../../shared/stores/use-tree-store';

import DocumentTreeNestedList from './document-tree-nested-list.vue';

const treeStore = useTreeStore();

onMounted(async () => {
  // ページ初回読込時はルートツリーを読み込む
  try {
    const response = await fetch('/api/tree/children', { method: 'GET' });
    const json: Result<Array<TreeItem>> = await response.json();
    if(json.error != null) return console.warn('Something Wrong', json);
    
    const rootTree = json.result;
    treeStore.mergeTree(rootTree);  // ソートなども行うので必ず mergeTree で設定する
  }
  catch(error) {
    console.error('Failed To Fetch Root Tree', error);
  }
});
</script>

<template>
  <DocumentTreeNestedList :tree="treeStore.tree" :nest-level="0" parent-uri-path="/wiki" />
</template>
