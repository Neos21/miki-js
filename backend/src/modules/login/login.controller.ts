import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';

import { LoginService } from './login.service';

@Controller('/api/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }
  
  @Post('')
  public async login(@Body('misskeyUserName') misskeyUserName: string, @Body('misskeyHost') misskeyHost: string, @Body('password') password: string, @Res() res: Response): Promise<Response<Result<User>>> {
    const result = await this.loginService.login(misskeyUserName, misskeyHost, password);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
