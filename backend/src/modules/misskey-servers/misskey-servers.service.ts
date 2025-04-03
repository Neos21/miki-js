import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MisskeyServer } from '../../common/types/misskey-server';
import { Result } from '../../common/types/result';
import { MisskeyServerEntity } from '../../shared/entities/misskey-server.entity';

@Injectable()
export class MisskeyServersService {
  constructor(@InjectRepository(MisskeyServerEntity) private readonly misskeyServersRepository: Repository<MisskeyServerEntity>) { }
  
  public async findMisskeyServers(): Promise<Result<Array<MisskeyServer>>> {
    try {
      const misskeyServers = await this.misskeyServersRepository.find({ order: { id: 'ASC' } });
      return { result: misskeyServers };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
