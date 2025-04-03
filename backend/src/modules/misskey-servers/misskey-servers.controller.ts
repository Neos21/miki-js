import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

import { MisskeyServer } from '../../common/types/misskey-server';
import { Result } from '../../common/types/result';

import { MisskeyServersService } from './misskey-servers.service';

@Controller('/api/misskey-servers')
export class MisskeyServersController {
  constructor(private readonly misskeyServersService: MisskeyServersService) { }
  
  @Get('')
  public async findMisskeyServers(@Res() res: Response): Promise<Response<Result<Array<MisskeyServer>>>> {
    const result = await this.misskeyServersService.findMisskeyServers();
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
