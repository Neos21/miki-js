export type TreeItem = {
  id?: string;
  uri?: string;
  title?: string;
  /** 子階層がなさそうなら `null` になる */
  children?: Array<TreeItem> | null;
  
  /** フロントエンドにて対象のメニューが開いた状態にあるか否か */
  isOpened?: boolean;
};
