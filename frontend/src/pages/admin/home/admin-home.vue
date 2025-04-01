<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { v4 } from 'uuid';
import { useRouter } from 'vue-router';

import { isEmptyString } from '../../../common/helpers/is-empty-string';
import { MisskeyHost } from '../../../common/types/misskey-host';
import { Result } from '../../../common/types/result';
import { useAdminStore } from '../../../shared/stores/use-admin-store';


const router = useRouter();
const adminStore = useAdminStore();

const isValid      = ref<boolean>(false);
const misskeyHosts = ref<Array<MisskeyHost>>([{ id: v4(), protocol: 'https://', host: '' }]);  // `:key` に指定する一意な値として UUID を指定している

const hostRules = [
  (value: string): boolean | string => {
    if(isEmptyString(value)) return '空値にはできません';
    return true;
  }
];

const onAddRow = (): void => {
  misskeyHosts.value.push({ id: v4(), protocol: 'https://', host: '' });
};

const onRemoveRow = (index: number): void => {
  misskeyHosts.value.splice(index, 1);
};

const onSave = async (): Promise<void> => {
  try {
    // バックエンドで表示順を保持できるように ID を連番に変換する
    const misskeyHostsToPost = misskeyHosts.value.map((misskeyHost, index) => {
      misskeyHost.id = index + 1;  // 
      return misskeyHost;
    });
    const response = await fetch('/api/admin/misskey-hosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminStore.jwt}`
      },
      body: JSON.stringify(misskeyHostsToPost)
    });
    const json = await response.json();
    if(json.error != null) return console.error('Something Wrong', json);  // TODO : エラー表示
    console.log('Saved', json);
  }
  catch(error) {
    console.error('Failed To Save Misskey Hosts', error);  // TODO : エラー表示
  }
};

const onLogout = (): void => {
  adminStore.setJwt('');
  router.push('/');
};

onMounted(async () => {
  const response = await fetch('/api/misskey-hosts', { method: 'GET' });
  const json: Result<Array<MisskeyHost>> = await response.json();
  if(json.error != null) return console.error('Something Wrong', json);
  if(json.result.length > 0) misskeyHosts.value = json.result.map(misskeyHost => {
    misskeyHost.id = v4();
    return misskeyHost;
  });
});
</script>

<template>
  <h1>管理用エリア</h1>
  
  <h2>Misskey サーバ定義</h2>
  <p>MiAuth でアカウント登録を可能にする Misskey サーバを1つ以上設定してください。</p>
  <v-form v-model="isValid" class="mt-2">
    <div v-for="(misskeyHost, index) in misskeyHosts" :key="misskeyHost.id" class="misskey-host-row">
      <v-select v-model="misskeyHost.protocol" :items="['https://', 'http://']" label="プロトコル" density="compact" class="misskey-host-protocol" />
      <v-text-field v-model="misskeyHost.host" :rules="hostRules" label="Misskey サーバ URL" required density="compact" class="misskey-host" />
      <v-btn color="error" :disabled="index === 0" class="misskey-host-remove-button" @click="onRemoveRow(index)">削除</v-btn>
    </div>
    <p><v-btn @click="onAddRow">追加</v-btn></p>
    <p class="text-right"><v-btn :disabled="!isValid" @click="onSave">保存</v-btn></p>
  </v-form>
  
  <h2>管理者ログアウト</h2>
  <p class="text-right"><v-btn @click="onLogout">管理者ログアウト</v-btn></p>
</template>

<style scoped>
.misskey-host-row {
  display: flex;
  column-gap: .5rem;
}

.misskey-host-protocol {
  flex-basis: 9rem;
  flex-grow: 0;
}

.misskey-host-remove-button {
  flex-grow: 0;
}
</style>
