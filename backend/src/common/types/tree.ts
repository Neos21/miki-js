export type Tree = Array<{
  id?: string;
  uri?: string;
  title?: string;
  children?: Tree;
}>;
