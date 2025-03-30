import { defineStore } from 'pinia';

import type { User } from '../../common/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User
  }),
  actions: {
    getUser(): {[key: string]: any} {
      if(Object.keys(this.user).length === 0) {
        const user = window.localStorage.getItem('user');
        const parsedUser = user == null ? {} : JSON.parse(user);  // Throws
        this.user = parsedUser;
      }
      return this.user;
    },
    setUser(user: User): void {
      this.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    },
  }
});
