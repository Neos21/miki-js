import { createRouter, createWebHistory } from 'vue-router';

import Admin from '../../pages/admin/admin.vue';
import Home from '../../pages/home/home.vue';

const routes = [
  { path: '/'     , component: Home  },
  { path: '/admin', component: Admin }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
