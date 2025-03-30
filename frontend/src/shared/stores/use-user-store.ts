import { defineStore } from 'pinia';

import { isEmptyString } from '../helpers/is-empty-string';

interface User {
  id: string;
  name: string;
  username: string;
  host: null;
  avatarUrl: string;
  avatarBlurhash: string;
  avatarDecorations: Array<any>;
  isBot: boolean;
  isCat: boolean;
  makeNotesFollowersOnlyBefore: number;
  emojis: {[key: string]: any}
  onlineStatus: string;
  badgeRoles: Array<any>;
  url: null;
  uri: null;
  movedTo: null;
  alsoKnownAs: null;
  createdAt: string;
  updatedAt: string;
  lastFetchedAt: null;
  bannerUrl: string;
  bannerBlurhash: string;
  isLocked: boolean;
  isSilenced: boolean;
  isSuspended: boolean;
  description: string;
  location: string;
  birthday: string;
  lang: string;
  fields: Array<any>
}

export const useUserStore = defineStore('user', {
  state: () => ({
    sessionId: '',
    token: '',
    user: {} as User
  }),
  actions: {
    getSessionId(): string {
      if(isEmptyString(this.sessionId)) {
        const sessionId = window.localStorage.getItem('session-id');
        this.sessionId = sessionId ?? '';
      }
      return this.sessionId;
    },
    getToken(): string {
      if(isEmptyString(this.token)) {
        const token = window.localStorage.getItem('token');
        this.token = token ?? '';
      }
      return this.token;
    },
    getUser(): {[key: string]: any} {
      if(Object.keys(this.user).length === 0) {
        const user = window.localStorage.getItem('user');
        const parsedUser = user == null ? {} : JSON.parse(user);  // Throws
        this.user = parsedUser;
      }
      return this.user;
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
