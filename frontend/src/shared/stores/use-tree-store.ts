import { defineStore } from 'pinia';

import { Result } from '../../common/types/result';
import { Tree } from '../../common/types/tree';

export const useTreeStore = defineStore('tree', {
  state: () => ({
    tree: [] as Tree,
    rootStatus: 'LOADING' as 'LOADING' | 'LOADED' | 'ERROR'
  }),
  actions: {
    async fetchRootTree(): Promise<void> {
      try {
        this.rootStatus = 'LOADING';
        const response = await fetch('/api/tree', { method: 'GET' });
        const json: Result<Tree> = await response.json();
        if(json.error != null) {
          console.warn('Something Wrong', json);
          this.rootStatus = 'ERROR';
          return;
        }
        this.tree = json.result;  // NOTE : 今までキャッシュしていた子階層分が全部消える
        this.rootStatus = 'LOADED';
      }
      catch(error) {
        console.error('Failed To Get Root Tree', error);
        this.rootStatus = 'ERROR';
      }
    }
  }
});
