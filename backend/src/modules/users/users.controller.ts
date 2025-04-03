import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
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
}
