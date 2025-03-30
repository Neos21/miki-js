import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserApi } from '../../common/types/user';

@Controller('/api/users')
export class UsersController {
  constructor() { }
  
  @Get(':id')
  public getUser(@Param('id') id: string): string {
    return 'getUser';
  }
  
  @Post('')
  public createUser(@Body() userApi: UserApi): string {
    return 'createUser';
  }
}
