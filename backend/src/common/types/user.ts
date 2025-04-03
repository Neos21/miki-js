/** https://【Misskey Host】/api-doc#tag/auth/POST/auth/session/userkey より・最小限使うモノのみ記載 */
export type MisskeyUser = {
  name: string;
  username: string;
  avatarUrl: string;
}

export type User = {
  /** `@misskeyUserName@misskeyHost` の形式 */
  id?: string;
  misskeyUserName?: string;
  misskeyHost?: string;
  
  /** 表示名 */
  name?: string;
  avatarUrl?: string;
  
  token?: string;
  accessToken?: string;
  misskeyUser?: MisskeyUser;
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
