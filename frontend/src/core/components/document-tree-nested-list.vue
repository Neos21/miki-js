<script setup lang="ts">
import NestedList from './document-tree-nested-list.vue';

defineProps<{
  items: { title: string; children?: any[] }[],
  isRoot: boolean
}>();
</script>

<template>
  <v-list-group v-for="item in items" :key="item.title" :value="item.title" class="list-group">
    <template #activator="{ props }">
      <v-list-item v-if="isRoot" v-bind="props" :title="item.title" class="list-item root-list-item" ></v-list-item>
      <v-list-item v-else        v-bind="props" :title="item.title" class="list-item child-list-item"></v-list-item>
    </template>
    <NestedList v-if="item.children?.length" :items="item.children" :isRoot="false" />
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
