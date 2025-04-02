<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { epochTimeMsToJstString } from '../../common/helpers/convert-date-to-jst';
import { Document } from '../../common/types/document';
import { Result } from '../../common/types/result';
import { renderMarkdown } from '../../shared/helpers/render-markdown';

const route  = useRoute();
const router = useRouter();

const path            = ref<string>('');
const currentDocument = ref<Document | null>(null);
const htmlContent     = ref<string>('');

const fetchDocument = async (): Promise<void> => {
  path.value = (route.params.catchAll as string ?? '').replace(/(?<!^)(\/*)$/, '');
  
  try {
    const response = await fetch(`/api/documents/${path.value}`, { method: 'GET' });
    const json: Result<Document> = await response.json();
    if(json.error != null) {
      console.error('Something Wrong', json);
      router.push('/');
      return;
    }
    
    console.log('Document Fetched', json);
    currentDocument.value = json.result;
    htmlContent.value     = renderMarkdown(json.result.content!);
    
    // TODO : テスト
    const testRes = await fetch(`/api/tree/to-root?targetDocumentId=${currentDocument.value.id}`, { method: 'GET' });
    const testJson = await testRes.json();
    console.log('結果', testJson);
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
  <header class="header">{{ currentDocument?.title || '&nbsp;' }}</header>
  <div v-html="htmlContent" />  <!-- eslint-disable-line vue/no-v-html -->
  <footer class="footer">Last-Modified : {{ currentDocument?.updatedAt ? epochTimeMsToJstString(new Date(currentDocument.updatedAt).getTime() as unknown as string, 'YYYY-MM-DD HH:mm:SS') : '' }} By {{ currentDocument?.updatedUserId }}</footer>
</template>

<style scoped>
.header {
  margin: -16px -16px 0 !important;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, .12);
  font-size: 1.5rem;
  background: #f5f5f5;
}

.footer {
  margin: 3rem -16px 0;
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, .12);
  color: #3f3f3f;
  font-size: .85rem;
  text-align: right;
  background: #f5f5f5;
}
</style>
