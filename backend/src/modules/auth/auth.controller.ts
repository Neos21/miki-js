import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';

import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post('misskey-login')
  public async misskeyLogin(@Body('misskeyHost') misskeyHost: string, @Body('origin') origin: string, @Res() res: Response): Promise<Response<Result<{ token: string, url: string }>>> {
    const result = await this.authService.misskeyLogin(misskeyHost, origin);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
  
  @Post('misskey-callback')
  public async misskeyCallback(@Body('misskeyHost') misskeyHost: string, @Body('token') token: string, @Res() res: Response): Promise<Response<Result<User>>> {
    const result = await this.authService.misskeyCallback(misskeyHost, token);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
