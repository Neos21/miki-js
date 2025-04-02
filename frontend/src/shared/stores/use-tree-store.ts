import { defineStore } from 'pinia';

import { TreeItem } from '../../common/types/tree-item';

export const useTreeStore = defineStore('tree', {
  state: () => ({
    tree: [] as Array<TreeItem>
  }),
  actions: {
    /** 取得した部分ツリーをマージする */
    mergeTree(partialTree: Array<TreeItem>) {
      partialTree.forEach(treeItem => {
        this.mergeTreeItem(this.tree, treeItem);
      });
      this.tree = this.sortTree(this.tree);
      this.moveHomeToTop();
    },
    /** 再帰的にツリー要素をマージする (この関数自体を直接呼ぶ必要はない) */
    mergeTreeItem(targetTree: Array<TreeItem>, treeItem: TreeItem) {
      const existingTreeItem = targetTree.find(targetTreeItem => targetTreeItem.id === treeItem.id);
      if(existingTreeItem != null) {
        // 既存 TreeItem がある場合 : 内容を更新する
        existingTreeItem.uri   = treeItem.uri;
        existingTreeItem.title = treeItem.title;
        if(treeItem.isOpened) existingTreeItem.isOpened = treeItem.isOpened;  // ツリーを開きたい時だけ開く情報をマージする
        // 子ツリーが `null` ではなく何らかの配列ならマージする
        if(existingTreeItem.children != null && treeItem.children != null) {
          treeItem.children.forEach(childTreeItem => {
            this.mergeTreeItem(existingTreeItem.children!, childTreeItem);
          });
        }
      }
      else {
        // 既存 TreeItem がない場合 : 追加する
        targetTree.push(treeItem);
      }
    },
    /** 再帰的にツリー全体を `title` の昇順でソートする (この関数自体を直接呼ぶ必要はない) */
    sortTree(tree: Array<TreeItem>): Array<TreeItem> {
      return tree
        .map(treeItem => ({
          ...treeItem,
          children: treeItem.children ? this.sortTree(treeItem.children) : null,  // 再帰的に子要素をソートする
        }))
        .sort((treeItemA, treeItemB) => {
          // `title` の昇順でソートする
          return treeItemA.title!.localeCompare(treeItemB.title!);
        });
    },
    /** ルート直下の `home` ページだけ、ツリーの一番上に固定表示させる (この関数自体を直接呼ぶ必要はない) */
    moveHomeToTop(): void {
      const homeIndex = this.tree.findIndex(treeItem => treeItem.uri === 'home');
      if(homeIndex > 0) {
        const [homeTreeItem] = this.tree.splice(homeIndex, 1);
        this.tree.unshift(homeTreeItem);
      }
    }
    // - [x] ページ初期表示時 : 初回のルートツリーは上書き指定で読み込む
    // - [x] ツリーから Wiki ページに遷移してきた時 : ユーザ操作で既にツリーは出来上がっているので特に処理不要
    // - [x] Wiki ページの URL に直遷移してきた時 : ルートツリー上書きのあと、指定階層までの取得が必要
    // - [x] ページの新規作成時 : 作成したドキュメントの Wiki ページを「URL 直遷移」してきた時のようにする (ルートツリー上書きと指定階層までの取得)
    // - [x] ツリーから Edit ページに遷移してきた時 : ユーザ操作で既にツリーは出来上がっているので特に処理不要
    // - [x] Edit ページの URL に直遷移してきた時 : ルートツリー上書きのあと、指定階層までの取得が必要
    // - [x] ページのタイトル変更時 : ソートをやり直す
    // - [ ] TODO : ドキュメントの移動 : 配下のドキュメントの Parent Document ID は変化しない。移動直後は、移動したドキュメントの Wiki ページを「URL 直遷移」してきた時のようにする (ルートツリー上書きと指定階層までの取得)
    // - [ ] TODO : ドキュメントの削除 : 配下にドキュメントがある場合は削除不可とし、単一ドキュメントのみ削除可能な仕様にすることでツリー更新も楽にする
  }
});
