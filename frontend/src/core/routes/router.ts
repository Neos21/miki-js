import { createRouter, createWebHistory } from 'vue-router';

import Admin from '../../pages/admin/admin.vue';
import Home from '../../pages/home/home.vue';
import NewRootDocument from '../../pages/new-root-document/new-root-document.vue';
import UserPreferences from '../../pages/user-preferences/user-preferences.vue';
import Wiki from '../../pages/wiki/wiki.vue';
import { loginGuard } from './login-guard';

const routes = [
  { path: '/'                  , component: Home                                       },
  { path: '/wiki'              , redirect : '/'                                        },
  { path: '/wiki/:catchAll(.*)', component: Wiki                                       },
  { path: '/new-root-document' , component: NewRootDocument, beforeEnter: [loginGuard] },
  { path: '/user-preferences'  , component: UserPreferences, beforeEnter: [loginGuard] },
  { path: '/admin'             , component: Admin                                      }  // TODO : Guard
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
