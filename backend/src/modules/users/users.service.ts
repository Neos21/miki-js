import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Result } from '../../common/types/result';
import { User } from '../../common/types/user';
import { UserEntity } from '../../shared/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) { }
  
  public async findUserById(id: string): Promise<Result<User>> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if(user == null) return { error: 'User Not Found', code: HttpStatus.NOT_FOUND };
      return { result: user };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  public async saveUserById(id: string, user: User): Promise<Result<User>> {
    try {
      await this.usersRepository.update(id, user as UserEntity);
      return this.findUserById(id);
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  public async removeUserById(id: string): Promise<Result<boolean>> {
    try {
      await this.usersRepository.delete(id);
      return { result: true };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
