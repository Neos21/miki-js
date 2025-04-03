import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MisskeyServer } from '../../../common/types/misskey-server';
import { Result } from '../../../common/types/result';
import { MisskeyServerEntity } from '../../../shared/entities/misskey-server.entity';

@Injectable()
export class AdminMisskeyServersService {
  constructor(@InjectRepository(MisskeyServerEntity) private readonly misskeyServersRepository: Repository<MisskeyServerEntity>) { }
  
  public async updateAllMisskeyServers(misskeyServers: Array<MisskeyServer>): Promise<Result<Array<MisskeyServer>>> {
    try {
      await this.misskeyServersRepository.delete({});  // Delete All
      const updatedMisskeyServers = await this.misskeyServersRepository.save(misskeyServers as Array<MisskeyServerEntity>);
      return { result: updatedMisskeyServers };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
