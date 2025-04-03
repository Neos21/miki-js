import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { isEmptyObject } from '../../common/helpers/is-empty-object';
import { isEmptyString } from '../../common/helpers/is-empty-string';
import { Result } from '../../common/types/result';
import { MisskeyUser, User } from '../../common/types/user';
import { MisskeyServerEntity } from '../../shared/entities/misskey-server.entity';
import { UserEntity } from '../../shared/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MisskeyServerEntity) private readonly misskeyServersRepository: Repository<MisskeyServerEntity>,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>
  ) { }
  
  /** 旧来型のアプリ作成方式でアクセストークンを発行していく : https://misskey-hub.net/ja/docs/for-developers/api/token/app/ */
  public async misskeyLogin(misskeyHost: string, origin: string): Promise<Result<{ token: string, url: string }>> {
    try {
      const misskeyServerResult = await this.findMisskeyServerByHost(misskeyHost);
      if(misskeyServerResult.error != null) return misskeyServerResult;  // DB に定義がない Misskey サーバは許可しない
      
      let appSecret: string;
      if(isEmptyString(misskeyServerResult.result.appSecret)) {
        // `appSecret` がないので `/app/create` エンドポイントを先に叩く
        const appSecretResult = await this.createApp(misskeyHost, origin);
        if(appSecretResult.error != null) return appSecretResult;
        
        appSecret = appSecretResult.result.appSecret;
        await this.updateMisskeyServer(misskeyHost, appSecret);  // `appSecret` を保存する
      }
      else {
        // DB から取得した `appSecret` を使用する
        appSecret = misskeyServerResult.result.appSecret!;
      }
      
      const result = await this.generateSession(misskeyHost, appSecret);
      return result;
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  public async misskeyCallback(misskeyHost: string, token: string): Promise<Result<User>> {
    try {
      const misskeyServerResult = await this.findMisskeyServerByHost(misskeyHost);
      if(misskeyServerResult.error != null) return misskeyServerResult;
      
      const appSecret = misskeyServerResult.result.appSecret;
      const userKeySessionResult = await this.userKeySession(misskeyHost, appSecret, token);
      if(userKeySessionResult.error != null) return userKeySessionResult;
      
      const accessToken = userKeySessionResult.result.accessToken;
      const misskeyUser = userKeySessionResult.result.user;
      const createdUserResult = await this.createUser(misskeyHost, token, accessToken, misskeyUser);
      return createdUserResult;
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  private async findMisskeyServerByHost(host: string): Promise<Result<MisskeyServerEntity>> {
    try {
      const misskeyServer = await this.misskeyServersRepository.findOne({
        select: ['host', 'appSecret'],
        where: { host }
      });
      if(misskeyServer == null) return { error: 'Misskey Server Not Found', code: HttpStatus.NOT_FOUND };
      return { result: misskeyServer };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  private async createApp(misskeyHost: string, origin: string): Promise<Result<{ appSecret: string }>> {
    try {
      // https://【Misskey Host】/api-doc#tag/app/POST/app/create
      const response = await fetch(`https://${misskeyHost}/api/app/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name       : 'Miki.js',
          description: 'Wiki System With Misskey Login',
          permission : ['read:account'],
          callbackUrl: `${origin}/auth/callback`
        })
      });
      const json: { secret: string } = await response.json();
      if(isEmptyString(json.secret)) return { error: 'Failed To Call /api/app/create', code: HttpStatus.BAD_REQUEST };
      
      return { result: { appSecret: json.secret } };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  private async updateMisskeyServer(host: string, appSecret: string): Promise<Result<boolean>> {
    try {
      await this.misskeyServersRepository.createQueryBuilder()
        .update()
        .set({ appSecret })
        .where({ host })
        .execute();
      return { result: true };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  private async generateSession(misskeyHost: string, appSecret: string): Promise<Result<{ token: string, url: string }>> {
    try {
      // https://【Misskey Host】/api-doc#tag/auth/POST/auth/session/generate
      const response = await fetch(`https://${misskeyHost}/api/auth/session/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appSecret })
      });
      const json: { token: string, url: string } = await response.json();
      if(isEmptyString(json.token) || isEmptyString(json.url)) return { error: 'Invalid Response', code: HttpStatus.INTERNAL_SERVER_ERROR };
      
      return { result: json };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  private async userKeySession(misskeyHost: string, appSecret: string, token: string): Promise<Result<{ accessToken: string, user: MisskeyUser }>> {
    try {
      // https://【Misskey Host】/api-doc#tag/auth/POST/auth/session/userkey
      const response = await fetch(`https://${misskeyHost}/api/auth/session/userkey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appSecret, token })
      });
      const json: { accessToken: string, user: MisskeyUser } = await response.json();
      if(isEmptyString(json.accessToken)) return { error: 'Access Token Is Empty', code: HttpStatus.BAD_REQUEST };
      if(isEmptyObject(json.user)) return { error: 'User Is Empty', code: HttpStatus.BAD_REQUEST };
      
      return { result: json };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  private async createUser(misskeyHost: string, token: string, accessToken: string, misskeyUser: MisskeyUser): Promise<Result<User>> {
    try {
      const misskeyUserName = misskeyUser.username;
      const name            = misskeyUser.name;
      const avatarUrl       = misskeyUser.avatarUrl || undefined;
      const id              = `@${misskeyUserName}@${misskeyHost}`;
      
      const userEntity = new UserEntity({ id, misskeyUserName, misskeyHost, name, avatarUrl, token, accessToken, misskeyUser });
      const createdUser = await this.usersRepository.save(userEntity);
      if(createdUser == null) return { error: 'Failed To Save User', code: HttpStatus.INTERNAL_SERVER_ERROR };
      
      delete (createdUser as any).token;
      delete (createdUser as any).accessToken;
      return { result: createdUser };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
