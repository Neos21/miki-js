import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { useUserStore } from '../../shared/stores/use-user-store';

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const loginGuard = (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore();
  isEmptyObject(userStore.user) ? next('/') : next();
};
