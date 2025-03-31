<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { renderMarkdown } from '../../shared/helpers/render-markdown';

const route  = useRoute();
const router = useRouter();

const path    = ref<string>('');
const title   = ref<string>('');
const content = ref<string>('');

const fetchDocument = async (): Promise<void> => {
  path.value = (route.params.catchAll as string ?? '').replace(/(?<!^)(\/*)$/, '');
  
  try {
    const response = await fetch(`/api/documents/${path.value}`, { method: 'GET' });
    const json = await response.json();
    if(json.error != null) {
      console.warn('Something Wrong', json);
      router.push('/');
      return;
    }
    
    console.log('Document Fetched', json);
    title.value   = json.result.title;
    content.value = renderMarkdown(json.result.content);
  }
  catch(error) {
    console.error('Failed To Fetch Document', error);
    router.push('/');
  }
};

// 初回表示時
onMounted(fetchDocument);
// ルート変更時に再読込
watch(() => route.path, fetchDocument);
</script>

<template>
  <header class="header">
    <div class="header-title">{{ title }}</div>
    <v-btn :to="`/edit/${path}`">編集</v-btn>
  </header>
  <div v-html="content" />
</template>

<style scoped>
.header {
  display: flex;
  column-gap: 1rem;
  margin: -16px -16px 0 !important;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, .12);
  font-size: 1.5rem;
  background: #f5f5f5;
}

.header-title {
  flex-grow: 1;
}
</style>
