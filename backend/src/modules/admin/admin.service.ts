import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { isEmptyString } from '../../common/helpers/is-empty-string';
import { Result } from '../../common/types/result';

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) { }
  
  public async login(password: string): Promise<Result<{ jwt: string }>> {
    if(isEmptyString(password)) return { error: 'The Password Is Empty', code: HttpStatus.BAD_REQUEST };
    
    const adminPassword = this.configService.get<string>('adminPass');
    if(isEmptyString(adminPassword)) return { error: 'Admin Password Is Invalid', code: HttpStatus.INTERNAL_SERVER_ERROR };
    
    if(password !== adminPassword) return { error: 'Invalid Password', code: HttpStatus.BAD_REQUEST };
    
    try {
      const jwtPayload = { lastLoginAt: new Date().getTime().toString() };  // 特に入れておく情報がない
      const jwt = await this.jwtService.signAsync(jwtPayload);
      return { result: { jwt } };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
