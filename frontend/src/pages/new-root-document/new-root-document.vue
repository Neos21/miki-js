<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '../../shared/stores/use-user-store';
import { useTreeStore } from '../../shared/stores/use-tree-store';
import { Document } from '../../common/types/document';
import { Result } from '../../common/types/result';
import { titleRules } from '../../shared/helpers/validator-title-rules';

const router = useRouter();
const userStore = useUserStore();
const treeStore = useTreeStore();

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
      parentDocumentId : undefined,
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
    console.log('Root Document Created', json);
    
    // ツリーを再読込する
    await treeStore.fetchRootTree();
    // 新規作成したページに移動する
    router.push(`/wiki/${uri.value}`);
  }
  catch(error) {
    console.error('Failed To Create Root Document', error);
    alert('Error : Failed To Create Root Document');
  }
};
</script>

<template>
  <h1>ドキュメントを作成</h1>
  <v-form v-model="isValid">
    <v-text-field v-model="uri"   :rules="uriRules"   label="URI"   required class="mt-5"></v-text-field>
    <v-text-field v-model="title" :rules="titleRules" label="Title" required class="mt-2"></v-text-field>
    <v-btn :disabled="!isValid" @click="onSubmit" class="mt-2">作成</v-btn>
  </v-form>
</template>
