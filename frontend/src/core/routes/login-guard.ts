import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { useUserStore } from '../../shared/stores/use-user-store';

export const loginGuard = (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore();
  if(isEmptyObject(userStore.user)) {
    next('/')
  }
  else {
    next();
  }
};
