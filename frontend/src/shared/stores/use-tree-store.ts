import { defineStore } from 'pinia';

import { Result } from '../../common/types/result';
import { TreeItem } from '../../common/types/tree-item';

export const useTreeStore = defineStore('tree', {
  state: () => ({
    tree: [] as Array<TreeItem>
  }),
  actions: {
    async fetchRootTree(): Promise<void> {
      try {
        const response = await fetch('/api/tree/children', { method: 'GET' });
        const json: Result<Array<TreeItem>> = await response.json();
        if(json.error != null) return console.warn('Something Wrong', json);
        
        const rootTree = json.result.map(treeItem => {
          treeItem.isOpened = false;
          return treeItem;
        });
        this.tree = rootTree;  // NOTE : 今までキャッシュしていた子階層分が全部消える
      }
      catch(error) {
        console.error('Failed To Fetch Root Tree', error);
      }
    }
  }
});
