import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';

import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';
import { UserEntity } from '../../shared/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    private readonly usersService: UsersService
  ) { }
  
  public async login(misskeyUserName: string, misskeyHost: string, password: string): Promise<Result<User>> {
    try {
      const userWithPasswordHash = await this.usersRepository.findOne({
        select: ['misskeyUserName', 'misskeyHost', 'passwordHash'],
        where: { misskeyUserName, misskeyHost }
      });
      if(userWithPasswordHash == null) return { error: 'The User Does Not Exist', code: HttpStatus.BAD_REQUEST };
      
      const isValidPassword = await bcryptjs.compare(password, userWithPasswordHash.passwordHash);
      if(!isValidPassword) return { error: 'Invalid Password', code: HttpStatus.BAD_REQUEST };
      
      const id = `@${misskeyUserName}@${misskeyHost}`;
      return await this.usersService.getUser(id);
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
