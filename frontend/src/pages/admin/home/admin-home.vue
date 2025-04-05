<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { v4 } from 'uuid';
import { useRouter } from 'vue-router';

import { isEmptyString } from '../../../common/helpers/is-empty-string';
import { MisskeyServer } from '../../../common/types/misskey-server';
import { Result } from '../../../common/types/result';
import { validatorRuleNoEmpty } from '../../../shared/helpers/validator-rule-no-empty';
import { useAdminStore } from '../../../shared/stores/use-admin-store';

const router = useRouter();

const adminStore = useAdminStore();

const isValid        = ref<boolean>(false);
const misskeyServers = ref<Array<MisskeyServer>>([{ id: v4(), host: '' }]);  // NOTE : `:key` に指定する一意な値として、この画面内でのみ UUID を指定している
const errorMessage   = ref<string>('');
const isSuccessful   = ref<boolean>(false);  // 保存成功メッセージを一時的に表示する用

const onAddRow = (): void => {
  misskeyServers.value.push({ id: v4(), host: '' });
};

const onRemoveRow = (index: number): void => {
  misskeyServers.value.splice(index, 1);
};

const onSave = async (): Promise<void> => {
  try {
    errorMessage.value = '';
    isSuccessful.value = false;
    
    // バックエンドで表示順を保持できるように ID を連番に変換する
    const misskeyServersToPost = misskeyServers.value.map((misskeyServer, index) => {
      misskeyServer.id = index + 1;
      return misskeyServer;
    });
    const response = await fetch('/api/admin/misskey-servers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminStore.jwt}`
      },
      body: JSON.stringify(misskeyServersToPost)
    });
    const json: Result<Array<MisskeyServer>> = await response.json();
    if(json.error != null) {
      console.error('Failed To Save Misskey Servers', json);
      errorMessage.value = `保存に失敗しました : ${json.code} ${json.error}`;
      return;
    }
    
    console.log('Misskey Servers Saved', json);
    isSuccessful.value = true;
    setTimeout(() => {
      isSuccessful.value = false;
    }, 3000);
  }
  catch(error: any) {
    console.error('Save Misskey Servers : Unknown Error', error);
    errorMessage.value = `保存に失敗しました : ${error.toString()}`;
  }
};

const onLogout = (): void => {
  adminStore.setJwt('');
  router.push('/');
};

onMounted(async () => {
  try {
    const response = await fetch('/api/misskey-servers', { method: 'GET' });
    const json: Result<Array<MisskeyServer>> = await response.json();
    if(json.error != null) {
      console.error('Failed To Fetch Misskey Servers', json);
      errorMessage.value = `サーバ一覧の取得に失敗しました : ${json.code} ${json.error}`;
      return;
    }
    if(json.result.length > 0) misskeyServers.value = json.result.map(misskeyServer => {
      misskeyServer.id = v4();  // NOTE : `:key` に指定する一意な値にするため変換しておく
      return misskeyServer;
    });
  }
  catch(error: any) {
    console.error('Fetch Misskey Servers : Unknown Error', error);
    errorMessage.value = `サーバ一覧の取得に失敗しました : ${error.toString()}`;
  }
});
</script>

<template>
  <h1>管理用エリア</h1>
  
  <h2>Misskey サーバ定義</h2>
  <p>Misskey でログインを可能にする Misskey サーバを1つ以上設定してください。</p>
  <v-form v-model="isValid" class="mt-2">
    <div v-for="(misskeyServer, index) in misskeyServers" :key="misskeyServer.id" class="misskey-server-row">
      <v-text-field v-model="misskeyServer.host" :rules="[validatorRuleNoEmpty]" label="ホスト名" required density="compact" class="misskey-host" />
      <v-btn color="error" :disabled="index === 0" class="misskey-server-remove-button" @click="onRemoveRow(index)">削除</v-btn>
    </div>
    <div class="misskey-servers-controls">
      <div><v-btn @click="onAddRow">行追加</v-btn></div>
      <div class="text-right"><v-btn :disabled="!isValid" @click="onSave">保存</v-btn></div>
    </div>
  </v-form>
  <v-alert v-if="isSuccessful" type="success" density="compact" class="mt-5" text="保存されました" />
  <v-alert v-if="!isEmptyString(errorMessage)" type="error" density="compact" class="mt-5" :text="errorMessage" closable />
  
  <hr>
  
  <h2>管理者ログアウト</h2>
  <p class="text-right"><v-btn @click="onLogout">管理者ログアウト</v-btn></p>
</template>

<style scoped>
.misskey-server-row {
  display: flex;
  column-gap: .5rem;
}

.misskey-server-remove-button {
  flex-grow: 0;
}

.misskey-servers-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
