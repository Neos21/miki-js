import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MisskeyHost } from '../../common/types/misskey-host';
import { Result } from '../../common/types/result';
import { MisskeyHostEntity } from '../../shared/entities/misskey-host.entity';

@Injectable()
export class MisskeyHostsService {
  constructor(@InjectRepository(MisskeyHostEntity) private readonly misskeyHostsRepository: Repository<MisskeyHostEntity>) { }
  
  public async getMisskeyHosts(): Promise<Result<Array<MisskeyHost>>> {
    try {
      const misskeyHosts = await this.misskeyHostsRepository.find({ order: { host: 'ASC' } });
      return { result: misskeyHosts };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
