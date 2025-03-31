<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useUserStore } from '../../shared/stores/use-user-store';
import { useTreeStore } from '../../shared/stores/use-tree-store';
import { Document } from '../../common/types/document';
import { Result } from '../../common/types/result';
import { titleRules } from '../../shared/helpers/validator-title-rules';
import { isEmptyString } from '../../common/helpers/is-empty-string';

const route  = useRoute();
const router = useRouter();

const userStore = useUserStore();
const treeStore = useTreeStore();

const parentPath       = ref<string>('');
const parentDocumentId = ref<string | null>(null);

const isValid = ref<boolean>(false);
const uri     = ref<string>('');
const title   = ref<string>('');

const uriRules = [
  (value: string): boolean | string => {
    if(value.trim() === '') return '空値にはできません';
    if(!/^[a-z0-9-]+$/.test(value)) return '半角英数字とハイフンのみ利用できます';
    const maxLength = 50;  // NOTE : テキトーに設定しておく
    if(value.length > maxLength) return `${maxLength} 文字以内で入力してください`;
    return true;
  }
];

const onSubmit = async (): Promise<void> => {
  try {
    const newDocument: Document = {
      uri              : uri.value,
      title            : title.value,
      content          : `# ${title.value}`,
      parentDocumentId : parentDocumentId.value ?? undefined,
      documentStructure: {},
      version          : 1,
      createdUserId    : userStore.user.id,
      updatedUserId    : userStore.user.id
    };
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDocument)
    });
    const json: Result<Document> = await response.json();
    if(json.error != null) {
      console.error('Something Wrong', json);
      return alert(`Error : ${json.error}`);
    }
    console.log('Document Created', json);
    
    if(isEmptyString(parentPath.value)) {
      // ツリーを再読込する
      await treeStore.fetchRootTree();
      // 新規作成したページに移動する
      router.push(`/wiki/${uri.value}`);
    }
    else {
      router.push(`/wiki/${parentPath.value}/${uri.value}`);
    }
  }
  catch(error) {
    console.error('Failed To Create Document', error);
    alert('Error : Failed To Create Document');
  }
};

onMounted(async () => {
  parentPath.value = (route.params.catchAll as string ?? '').replace(/(?<!^)(\/*)$/, '');
  if(isEmptyString(parentPath.value)) {
    parentDocumentId.value = null;
    return;
  }
  
  // 親ドキュメントの ID を取得する
  try {
    const response = await fetch(`/api/documents/${parentPath.value}`, { method: 'GET' });
    const json: Result<Document> = await response.json();
    if(json.error != null) {
      console.warn('Something Wrong', json);
      router.push('/');
      return;
    }
    
    parentDocumentId.value = json.result.id!;
    console.log('Document Fetched', json);
  }
  catch(error) {
    console.error('Failed To Fetch Parent Document', error);
    router.push('/');
  }
});
</script>

<template>
  <h1>ドキュメントを作成</h1>
  <p>配下に作成 : <code>/wiki/{{ parentPath }}</code></p>
  <v-form v-model="isValid">
    <p><v-text-field v-model="uri"   :rules="uriRules"   label="URI"   required></v-text-field></p>
    <p><v-text-field v-model="title" :rules="titleRules" label="Title" required></v-text-field></p>
    <p><v-btn :disabled="!isValid" @click="onSubmit">作成</v-btn></p>
  </v-form>
</template>
