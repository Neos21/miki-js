interface MisskeyUser {
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

export type User = {
  /** `@misskeyUserName@misskeyHost` の形式 */
  id?: string;
  misskeyUserName?: string;
  misskeyHost?: string;
  
  /** 表示名 */
  name?: string;
  avatarUrl?: string;
  
  sessionId?: string;
  token?: string;
  misskeyUser?: MisskeyUser;
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
