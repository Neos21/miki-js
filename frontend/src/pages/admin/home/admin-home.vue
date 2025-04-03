<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { v4 } from 'uuid';
import { useRouter } from 'vue-router';

import { isEmptyString } from '../../../common/helpers/is-empty-string';
import { MisskeyServer } from '../../../common/types/misskey-server';
import { Result } from '../../../common/types/result';
import { useAdminStore } from '../../../shared/stores/use-admin-store';

const router = useRouter();

const adminStore = useAdminStore();

const isValid        = ref<boolean>(false);
const misskeyServers = ref<Array<MisskeyServer>>([{ id: v4(), host: '' }]);  // NOTE : `:key` に指定する一意な値として、この画面内でのみ UUID を指定している

const hostRules = [
  (value: string): boolean | string => {
    if(isEmptyString(value)) return '空値にはできません';
    return true;
  }
];

const onAddRow = (): void => {
  misskeyServers.value.push({ id: v4(), host: '' });
};

const onRemoveRow = (index: number): void => {
  misskeyServers.value.splice(index, 1);
};

const onSave = async (): Promise<void> => {
  try {
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
    if(json.error != null) return console.error('Something Wrong', json);  // TODO : エラー表示
    console.log('Saved', json);
  }
  catch(error) {
    console.error('Failed To Save Misskey Servers', error);  // TODO : エラー表示
  }
};

const onLogout = (): void => {
  adminStore.setJwt('');
  router.push('/');
};

onMounted(async () => {
  const response = await fetch('/api/misskey-servers', { method: 'GET' });
  const json: Result<Array<MisskeyServer>> = await response.json();
  if(json.error != null) return console.error('Something Wrong', json);
  if(json.result.length > 0) misskeyServers.value = json.result.map(misskeyServer => {
    misskeyServer.id = v4();  // NOTE : `:key` に指定する一意な値にするため変換しておく
    return misskeyServer;
  });
});
</script>

<template>
  <h1>管理用エリア</h1>
  
  <h2>Misskey サーバ定義</h2>
  <p>Misskey でログインを可能にする Misskey サーバを1つ以上設定してください。</p>
  <v-form v-model="isValid" class="mt-2">
    <div v-for="(misskeyServer, index) in misskeyServers" :key="misskeyServer.id" class="misskey-server-row">
      <v-text-field v-model="misskeyServer.host" :rules="hostRules" label="ホスト名" required density="compact" class="misskey-host" />
      <v-btn color="error" :disabled="index === 0" class="misskey-server-remove-button" @click="onRemoveRow(index)">削除</v-btn>
    </div>
    <p><v-btn @click="onAddRow">追加</v-btn></p>
    <p class="text-right"><v-btn :disabled="!isValid" @click="onSave">保存</v-btn></p>
  </v-form>
  
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
</style>
