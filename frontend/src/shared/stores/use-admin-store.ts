import { defineStore } from 'pinia';

import { isEmptyString } from '../../common/helpers/is-empty-string';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    jwt: ''
  }),
  actions: {
    getJwt(): string {
      if(isEmptyString(this.jwt)) {
        const jwt = window.localStorage.getItem('jwt') ?? '';
        this.jwt = jwt;
      }
      return this.jwt;
    },
    setJwt(jwt: string): void {
      this.jwt = jwt;
      window.localStorage.setItem('jwt', jwt);
    }
  }
});
