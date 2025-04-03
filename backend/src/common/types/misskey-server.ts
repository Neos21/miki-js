export type MisskeyServer = {
  /** 管理画面上でのみ UUID を使う都合で `string` も含めてある */
  id?: number | string;
  host?: string;
  appSecret?: string;
};
