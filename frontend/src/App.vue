<script setup lang="ts">
import { v4 } from 'uuid';

const misskeyHostUrl = 'https://misskey.neos21.net';

const redirectToMiAuth = () => {
  const uuid = v4();
  localStorage.setItem('uuid', uuid);
  const params = new URLSearchParams({
    name: 'Miki.js',
    callback: window.location.href,  // コールバック URL
    permission: 'read:account'
  });
  const url = `${misskeyHostUrl}/miauth/${uuid}?${params.toString()}`;
  window.location.href = url;
};

const getUser = async () => {
  const uuid = localStorage.getItem('uuid');
  if(uuid == null || uuid === '') return alert('No Session ID');
  
  const response = await fetch(`${misskeyHostUrl}/api/miauth/${uuid}/check`, { method: 'POST' });
  const json = await response.json();
  console.log('JSON', json);  // json.token , json.user.id , json.user.username , json.user.name , json.user.avatarUrl
};
</script>

<template>
  <h1>Miki.js</h1>
  <p><button @click="redirectToMiAuth">認証する</button></p>
  <p><button @click="getUser">ユーザ情報を取得する</button></p>
</template>

<style scoped>
</style>
