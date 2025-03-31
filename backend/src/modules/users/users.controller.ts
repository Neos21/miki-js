import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';

import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @Post('')
  public async createUser(@Body() user: User, @Res() res: Response): Promise<Response<Result<User>>> {
    const result: Result<User> = await this.usersService.createUser(user);
    if(result.error != null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.CREATED).json(result);
  }
  
  @Get(':id')
  public async getUser(@Param('id') id: string, @Res() res: Response): Promise<Response<Result<User>>> {
    const result: Result<User> = await this.usersService.getUser(id);
    if(result.error != null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
