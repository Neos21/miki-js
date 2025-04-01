import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) { }
  
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = this.extractTokenFromHeader(request);
    if(jwt == null) throw new UnauthorizedException();  // リクエストヘッダから Bearer トークンが取得できなかった
    try {
      const jwtPayload = await this.jwtService.verifyAsync(
        jwt,
        { secret: this.configService.get<string>('jwtSecret') }
      );
      request.user = jwtPayload;  // リクエストオブジェクトのこの名前に Payload が入るようにする
    }
    catch(_error) {  // eslint-disable-line @typescript-eslint/no-unused-vars
      // トークン有効期限切れやトークン認証不正の場合
      throw new UnauthorizedException();
    }
    return true;
  }
  
  private extractTokenFromHeader(request: Request): string | null {
    const [type, jwt] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? jwt : null;
  }
}
