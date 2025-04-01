import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { isEmptyString } from '../../common/helpers/is-empty-string';
import { useAdminStore } from '../../shared/stores/use-admin-store';

export const adminGuard = (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext): void => {
  const adminStore = useAdminStore();
  if(isEmptyString(adminStore.getJwt())) {
    next('/admin/login');
  }
  else {
    next();
  }
};
