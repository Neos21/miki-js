import { defineStore } from 'pinia';

import { Result } from '../../common/types/result';
import { Tree } from '../../common/types/tree';

export const useTreeStore = defineStore('tree', {
  state: () => ({
    tree: [] as Tree
  }),
  actions: {
    async fetchRootTree(): Promise<void> {
      try {
        const response = await fetch('/api/tree', { method: 'GET' });
        const json: Result<Tree> = await response.json();
        if(json.error != null) return console.warn('Something Wrong', json);
        
        this.tree = json.result;  // NOTE : 今までキャッシュしていた子階層分が全部消える
      }
      catch(error) {
        console.error('Failed To Get Root Tree', error);
      }
    }
  }
});
