import { createRouter, createWebHistory } from 'vue-router';

import Admin from '../../pages/admin/admin.vue';
import AdminHome from '../../pages/admin/home/admin-home.vue';
import AdminLogin from '../../pages/admin/login/admin-login.vue';
import Auth from '../../pages/auth/auth.vue';
import AuthCallback from '../../pages/auth/callback/auth-callback.vue';
import Edit from '../../pages/edit/edit.vue';
import Home from '../../pages/home/home.vue';
import New from '../../pages/new/new.vue';
import UserPreferences from '../../pages/user-preferences/user-preferences.vue';
import Wiki from '../../pages/wiki/wiki.vue';

import { adminGuard } from './admin-guard';
import { authGuard } from './auth-guard';

const routes = [
  { path: '/'                  , component: Home                                       },
  { path: '/auth'              , component: Auth                                       },
  { path: '/auth/callback'     , component: AuthCallback                               },
  { path: '/wiki'              , redirect : '/'                                        },
  { path: '/wiki/:catchAll(.*)', component: Wiki                                       },
  { path: '/new'               , component: New            , beforeEnter: [authGuard]  },
  { path: '/new/:catchAll(.*)' , component: New            , beforeEnter: [authGuard]  },
  { path: '/edit'              , redirect : '/'                                        },
  { path: '/edit/:catchAll(.*)', component: Edit           , beforeEnter: [authGuard]  },
  { path: '/user-preferences'  , component: UserPreferences, beforeEnter: [authGuard]  },
  { path: '/admin'             , component: Admin                                      },
  { path: '/admin/login'       , component: AdminLogin                                 },
  { path: '/admin/home'        , component: AdminHome      , beforeEnter: [adminGuard] }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
