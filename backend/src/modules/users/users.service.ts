import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';
import { UserEntity } from '../../shared/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) { }
  
  public async createUser(user: User): Promise<Result<User>> {
    try {
      const createdUser = await this.usersRepository.save(user as UserEntity);
      return { result: createdUser };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  public async getUser(id: string): Promise<Result<User>> {
    try {
      const user = await this.usersRepository.findOneByOrFail({ id });
      return { result: user };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
