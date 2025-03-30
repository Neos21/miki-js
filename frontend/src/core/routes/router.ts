import { createRouter, createWebHistory } from 'vue-router';

import Admin from '../../pages/admin/admin.vue';
import Home from '../../pages/home/home.vue';
import UserPreferences from '../../pages/user-preferences/user-preferences.vue';

const routes = [
  { path: '/'                , component: Home            },
  { path: '/admin'           , component: Admin           },
  { path: '/user-preferences', component: UserPreferences }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
