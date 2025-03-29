import { defineStore } from 'pinia';

import { isEmptyString } from '../helpers/is-empty-string';

export const useUserStore = defineStore('user', {
  state: () => ({
    sessionId: '',
    token: '',
    user: {}
  }),
  actions: {
    loadFromLocalStorage(): void {
      const sessionId = window.localStorage.getItem('session-id');
      if(!isEmptyString(sessionId)) this.sessionId = sessionId!;
      const token = window.localStorage.getItem('token');
      if(!isEmptyString(token)) this.token = token!;
      const user = window.localStorage.getItem('user');
      if(!isEmptyString(user)) {
        try {
          const parsedUser = JSON.parse(user!);
          this.user = parsedUser;
        }
        catch(error) {
          console.error('Failed To Parse User', error);
        }
      }
    },
    setSessionId(sessionId: string): void {
      this.sessionId = sessionId;
      window.localStorage.setItem('session-id', sessionId);
    },
    setToken(token: string): void {
      this.token = token;
      window.localStorage.setItem('token', token);
    },
    setUser(user: {[key: string]: any}): void {
      this.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    }
  }
});
