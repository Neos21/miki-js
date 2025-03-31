import { createRouter, createWebHistory } from 'vue-router';

import Admin from '../../pages/admin/admin.vue';
import Edit from '../../pages/edit/edit.vue';
import Home from '../../pages/home/home.vue';
import New from '../../pages/new/new.vue';
import UserPreferences from '../../pages/user-preferences/user-preferences.vue';
import Wiki from '../../pages/wiki/wiki.vue';

import { loginGuard } from './login-guard';

const routes = [
  { path: '/'                  , component: Home                                       },
  { path: '/wiki'              , redirect : '/'                                        },
  { path: '/wiki/:catchAll(.*)', component: Wiki                                       },
  { path: '/new'               , component: New                                        },
  { path: '/new/:catchAll(.*)' , component: New                                        },
  { path: '/edit'              , redirect : '/'                                        },
  { path: '/edit/:catchAll(.*)', component: Edit                                       },
  { path: '/user-preferences'  , component: UserPreferences, beforeEnter: [loginGuard] },
  { path: '/admin'             , component: Admin                                      }  // TODO : Guard
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
