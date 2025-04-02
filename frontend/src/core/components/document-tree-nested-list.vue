<script setup lang="ts">
import { Result } from '../../common/types/result';
import { TreeItem } from '../../common/types/tree-item';
import { useTreeStore } from '../../shared/stores/use-tree-store';

import DocumentTreeNestedList from './document-tree-nested-list.vue';

defineProps<{
  tree: Array<TreeItem>,
  nestLevel: number,
  parentUriPath: string
}>();

const treeStore = useTreeStore();

const onToggleTreeItem = async (treeItem: TreeItem): Promise<void> => {
  treeItem.isOpened = !treeItem.isOpened;
  if(!treeItem.isOpened) return;  // 閉じられた時は配下の読み込み処理を行わない
  
  // NOTE : 処理軽減のため、既に配下に何もなかったことを確認済 (`treeItem.children == null`) の時や
  //        配下の要素を取得済み (`treeItem.children.length > 0`) の場合に API 呼び出しをしないことも考えたが
  //        裏で別ユーザによって更新があった時に検知できないので、必ず API を呼び出しマージすることにした
  
  // 指定 Document ID の直下にある要素を取得し設定する
  try {
    const response = await fetch(`/api/tree/children?parentDocumentId=${treeItem.id}`, { method: 'GET' });
    const json: Result<Array<TreeItem>> = await response.json();
    if(json.error != null) return console.error('Something Wrong', json);
    
    const children = json.result;
    if(children == null || children.length === 0) {
      treeItem.children = null;  // シェブロン記号の表示切り分けのために `null` と設定している
    }
    else {
       treeItem.children = json.result;  // このタイミングで mergeTree を使って設定しようとするとバグるので設定後にソートする
    }
    treeStore.mergeTree(treeStore.tree);
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
        <v-btn :icon="!treeItem.isOpened ? 'mdi-chevron-right' : (treeItem.children == null ? 'mdi-page-last' : 'mdi-chevron-down')" variant="plain" density="compact" color="white" class="list-item-button" @click="onToggleTreeItem(treeItem)" />
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
