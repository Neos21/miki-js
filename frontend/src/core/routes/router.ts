import { createRouter, createWebHistory } from 'vue-router';

import AdminLogin from '../../pages/admin/login/admin-login.vue';
import Edit from '../../pages/edit/edit.vue';
import Home from '../../pages/home/home.vue';
import Login from '../../pages/login/login.vue';
import New from '../../pages/new/new.vue';
import SignupCallback from '../../pages/signup/callback/signup-callback.vue';
import Signup from '../../pages/signup/signup.vue';
import UserPreferences from '../../pages/user-preferences/user-preferences.vue';
import Wiki from '../../pages/wiki/wiki.vue';

import { loginGuard } from './login-guard';

const routes = [
  { path: '/'                  , component: Home                                       },
  { path: '/login'             , component: Login                                      },
  { path: '/signup'            , component: Signup                                     },
  { path: '/signup/callback'   , component: SignupCallback                             },
  { path: '/wiki'              , redirect : '/'                                        },
  { path: '/wiki/:catchAll(.*)', component: Wiki                                       },
  { path: '/new'               , component: New                                        },
  { path: '/new/:catchAll(.*)' , component: New                                        },
  { path: '/edit'              , redirect : '/'                                        },
  { path: '/edit/:catchAll(.*)', component: Edit                                       },
  { path: '/user-preferences'  , component: UserPreferences, beforeEnter: [loginGuard] },
  { path: '/admin/login'       , component: AdminLogin                                 }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
