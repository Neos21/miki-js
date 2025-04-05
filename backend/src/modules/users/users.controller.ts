import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Res } from '@nestjs/common';
import { Response } from 'express';

import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';

import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @Get(':id')
  public async findUserById(@Param('id') id: string, @Res() res: Response): Promise<Response<Result<User>>> {
    const result = await this.usersService.findUserById(id);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
  
  @Patch(':id')
  public async saveUserById(@Param('id') id: string, @Body() user: User, @Res() res: Response): Promise<Response<Result<User>>> {
    const result = await this.usersService.saveUserById(id, user);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
  
  // TODO : 現状 JWT 認証などをしていないので API エンドポイントが知られてしまうと他人のアカウントも消せてします
  @Delete(':id')
  public async removeUserById(@Param('id') id: string, @Res() res: Response): Promise<Response<Result<User>>> {
    const result = await this.usersService.removeUserById(id);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(HttpStatus.NO_CONTENT);
  }
}
