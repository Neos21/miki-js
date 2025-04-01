import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { Result } from '../../common/types/result';

import { AdminService } from './admin.service';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }
  
  @Post('login')
  public async login(@Body('password') password: string, @Res() res: Response): Promise<Response<Result<{ jwt: string }>>> {
    const result = await this.adminService.login(password);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
