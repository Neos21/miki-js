import { Response } from 'express';

import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';

import { camelToSnakeCaseObject, snakeToCamelCaseObject } from '../../common/helpers/convert-case';
import { Result } from '../../common/types/result';
import { User, UserApi } from '../../common/types/user';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @Post('')
  public async createUser(@Body() userApi: UserApi, @Res() res: Response): Promise<Response<Result<User>>> {
    const user: User = snakeToCamelCaseObject(userApi);
    const result: Result<User> = await this.usersService.createUser(user);
    if(result.error != null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    const createdUserApi: UserApi = camelToSnakeCaseObject(result.result);
    return res.status(HttpStatus.CREATED).json({ result: createdUserApi });
  }
  
  @Get(':id')
  public async getUser(@Param('id') id: string, @Res() res: Response): Promise<Response<Result<User>>> {
    const result: Result<User> = await this.usersService.getUser(id);
    if(result.error != null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
