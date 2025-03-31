import { defineStore } from 'pinia';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { User } from '../../common/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User
  }),
  actions: {
    getUser(): {[key: string]: any} {
      if(isEmptyObject(this.user)) {
        const user = window.localStorage.getItem('user');
        try {
          const parsedUser = user == null ? {} : JSON.parse(user);
          this.user = parsedUser;
        }
        catch(error) {
          console.error('Failed To Parse User From LocalStorage');
          this.user = {};
        }
      }
      return this.user;
    },
    setUser(user: User): void {
      this.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    },
  }
});
