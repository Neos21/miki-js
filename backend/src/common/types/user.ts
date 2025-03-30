import { CamelToSnakeCaseObject } from './cases';

export type User = {
  /** `@misskeyHost@misskeyUserName` の形式 */
  id?: string;
  misskeyHost?: string;
  misskeyUserName?: string;
  
  /** 表示名 */
  name?: string;
  avatarUrl?: string;
  
  sessionId?: string;
  token?: string;
  misskeyUser?: any;
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type UserApi = CamelToSnakeCaseObject<User>;
