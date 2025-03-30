<script setup lang="ts">
import { ref } from 'vue';

import { camelToSnakeCaseObject } from '../../common/helpers/convert-case';
import { useUserStore } from '../../shared/stores/use-user-store';

import type { Document, DocumentApi } from '../../common/types/document';
import type { Result } from '../../common/types/result';

const userStore = useUserStore();

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
const titleRules = [
  (value: string): boolean | string => {
    if(value.trim() === '') return '空値にはできません';
    if(/^\s+|\s+$/g.test(value)) return '先頭や末尾には空白文字を入力できません';
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
    const newDocumentApi: DocumentApi = camelToSnakeCaseObject(newDocument);
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDocumentApi)
    });
    const createdDocumentResult: Result<DocumentApi> = await response.json();
    if(createdDocumentResult.error != null) return console.error('Failed To Create Root Document', createdDocumentResult);
    
    console.log('Root Document Created', createdDocumentResult);
    // TODO : 新規作成したページに移動する
  }
  catch(error) {
    console.error('Failed To Create Root Document', error);
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
