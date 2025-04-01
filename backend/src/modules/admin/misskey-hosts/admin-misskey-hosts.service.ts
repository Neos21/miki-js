import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MisskeyHost } from '../../../common/types/misskey-host';
import { Result } from '../../../common/types/result';
import { MisskeyHostEntity } from '../../../shared/entities/misskey-host.entity';

@Injectable()
export class AdminMisskeyHostsService {
  constructor(@InjectRepository(MisskeyHostEntity) private readonly misskeyHostsRepository: Repository<MisskeyHostEntity>) { }
  
  public async updateAllMisskeyHosts(misskeyHosts: Array<MisskeyHost>): Promise<Result<Array<MisskeyHost>>> {
    try {
      await this.misskeyHostsRepository.delete({});  // Delete All
      const updatedMisskeyHosts = await this.misskeyHostsRepository.save(misskeyHosts as Array<MisskeyHostEntity>);
      return { result: updatedMisskeyHosts };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
