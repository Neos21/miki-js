<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { isEmptyString } from '../../common/helpers/is-empty-string';
import { Document } from '../../common/types/document';
import { Result } from '../../common/types/result';
import { titleRules } from '../../shared/helpers/validator-document-title-rules';
import { useUserStore } from '../../shared/stores/use-user-store';

const route  = useRoute();
const router = useRouter();

const userStore = useUserStore();

const parentPath       = ref<string>('');
const parentDocumentId = ref<string | null>(null);
const isValid          = ref<boolean>(false);
const uri              = ref<string>('');
const title            = ref<string>('');
const errorMessage     = ref<string>('');

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
      console.error('Failed To Create Document', json);
      errorMessage.value = `ドキュメントの新規作成に失敗しました : ${json.code} ${json.error}`;
      return;
    }
    console.log('Document Created', json);
    
    // 新規作成したページに移動する : ツリー更新は Wiki ページ内で行う
    if(isEmptyString(parentPath.value)) {
      router.push(`/wiki/${uri.value}`);
    }
    else {
      router.push(`/wiki/${parentPath.value}/${uri.value}`);
    }
  }
  catch(error: any) {
    console.error('Create Document : Unknown Error', error);
    errorMessage.value = `ドキュメントの新規作成に失敗しました : ${error.toString()}`;
  }
};

onMounted(async () => {
  parentPath.value = (route.params.catchAll as string ?? '').replace(/(?<!^)(\/*)$/, '');
  // ルート直下にドキュメントを新規作成する場合
  if(isEmptyString(parentPath.value)) {
    parentDocumentId.value = null;
    return;
  }
  
  // 親ドキュメントの ID を取得する
  try {
    const response = await fetch(`/api/documents/${parentPath.value}`, { method: 'GET' });
    const json: Result<Document> = await response.json();
    if(json.error != null) {
      console.error('Failed To Fetch Parent Document', json);
      return router.push('/');
    }
    
    parentDocumentId.value = json.result.id!;
    console.log('Parent Document Fetched', json);
  }
  catch(error) {
    console.error('Fetch Parent Document : Unknown Error', error);
    router.push('/');
  }
});

// ルート変更時に再設定する
watch(() => route.path, (value: string) => {
  if(value === '/new') {
    parentPath.value       = '';
    parentDocumentId.value = null;
  }
});
</script>

<template>
  <h1>ドキュメントを作成</h1>
  <p>配下に作成 : <code>/wiki{{ isEmptyString(parentPath) ? '' : `/${parentPath}` }}</code></p>
  <v-form v-model="isValid">
    <p><v-text-field v-model="uri"   :rules="uriRules"   label="URI"      required /></p>
    <p><v-text-field v-model="title" :rules="titleRules" label="タイトル" required /></p>
    <p><v-btn :disabled="!isValid" @click="onSubmit">作成</v-btn></p>
  </v-form>
  <v-alert v-if="!isEmptyString(errorMessage)" type="error" density="compact" class="mt-5" :text="errorMessage" closable />
</template>
