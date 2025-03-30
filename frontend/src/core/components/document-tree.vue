<script setup lang="ts">
import NestedList from './document-tree-nested-list.vue';

// TODO : API で取ってくる
const documentStructure = [
  {
    title: 'Home',
    children: [
      { title: 'About', children: [] },
      {
        title: 'Docs',
        children: [
          {
            title: 'Guide',
            children: [
              {
                title: 'Introduction',
                children: [
                  { title: 'Getting Started', children: [] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  { title: 'Hoge', children: [] }
];
</script>

<template>
  <v-list density="compact">
    <NestedList :items="documentStructure" :isRoot="true" />
  </v-list>
</template>
