<script setup lang="ts">
import { Result } from '../../common/types/result';
import { TreeItem } from '../../common/types/tree-item';

import DocumentTreeNestedList from './document-tree-nested-list.vue';

defineProps<{
  tree: Array<TreeItem>,
  nestLevel: number,
  parentUriPath: string
}>();

const toggleTreeItem = async (treeItem: TreeItem): Promise<void> => {
  treeItem.isOpened = !treeItem.isOpened;
  if(!treeItem.isOpened) return;
  
  // 既に配下に何もないことを取得済
  if(treeItem.children == null) return;
  // 既に配下の要素を取得済のためキャッシュで動かす
  if(treeItem.children.length > 0) return;
  
  try {
    const response = await fetch(`/api/tree?parent_document_id=${treeItem.id}`, { method: 'GET' });
    const json: Result<Array<TreeItem>> = await response.json();
    if(json.error != null) return console.warn('Something Wrong', json);
    
    const children = json.result;
    if(children == null || children.length === 0) {
      treeItem.children = null;
    }
    else {
      treeItem.children = json.result;
    }
  }
  catch(error) {
    console.error('Failed To Fetch Child Tree', error);
  }
};
</script>

<template>
  <ul class="list" :style="`padding-left: ${8 * nestLevel}px`">
    <li v-for="treeItem in tree" :key="treeItem.id" class="list-item">
      <div class="list-item-title">
        <v-btn :icon="treeItem.children == null ? 'mdi-page-last' : treeItem.isOpened ? 'mdi-chevron-down' : 'mdi-chevron-right'" variant="plain" density="compact" color="white" class="list-item-button" @click="toggleTreeItem(treeItem)" />
        <RouterLink :to="`${parentUriPath}/${treeItem.uri}`" class="list-item-link">{{ treeItem.title }}</RouterLink>
      </div>
      <DocumentTreeNestedList v-if="treeItem.isOpened && treeItem.children != null && treeItem.children.length > 0" :tree="treeItem.children!" :nest-level="nestLevel + 1" :parent-uri-path="`${parentUriPath}/${treeItem.uri}`" />
    </li>
  </ul>
</template>

<style scoped>
.list {
  margin: 0;
  list-style: none;
}

.list-item-title {
  position: relative;
}

.list-item-button {
  position: absolute;
  top: 50%;
  left: 4px;
  transform: translateY(-50%);
  z-index: 1;
}

.list-item-link {
  position: relative;
  display: block;
  overflow: hidden;
  padding: 8px 6px 8px calc(24px + 4px + 6px);
  color: inherit;
  font-size: .75rem;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}
  .list-item-link::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    background: #fff;
    pointer-events: none;
  }
  .list-item-link:hover::before {
    opacity: .08;
  }
</style>
