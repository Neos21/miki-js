<script setup lang="ts">
import { Tree } from '../../common/types/tree';
import DocumentTreeNestedList from './document-tree-nested-list.vue';

defineProps<{
  tree: Tree,
  isRoot: boolean,
  parentUriPath: string
}>();
</script>

<template>
  <v-list-group v-for="treeItem in tree" :key="treeItem.title" :value="treeItem.title" class="list-group">
    <template #activator="{ props }">
      <v-list-item v-if="isRoot" v-bind="props" :title="treeItem.title" :to="`${parentUriPath}/${treeItem.uri}`" class="list-item root-list-item" ></v-list-item>
      <v-list-item v-else        v-bind="props" :title="treeItem.title" :to="`${parentUriPath}/${treeItem.uri}`" class="list-item child-list-item"></v-list-item>
    </template>
    <DocumentTreeNestedList v-if="treeItem.children != null && treeItem.children.length > 0" :tree="treeItem.children!" :isRoot="false" :parentUriPath="`${parentUriPath}/${treeItem.uri}`" />
  </v-list-group>
</template>

<style scoped>
.list-group {
  --list-indent-size: .75rem;
}

.list-item {
  min-height: auto;
}

.root-list-item {
  padding-inline-start: 16px;
}

.child-list-item {
  padding-inline-start: calc(var(--indent-padding) + .75rem) !important;
}

.list-item :deep(.v-list-item-title) {
  font-size: .75rem;
}
</style>
