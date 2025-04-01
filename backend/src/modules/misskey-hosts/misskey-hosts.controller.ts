import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

import { MisskeyHost } from '../../common/types/misskey-host';
import { Result } from '../../common/types/result';

import { MisskeyHostsService } from './misskey-hosts.service';

@Controller('/api/misskey-hosts')
export class MisskeyHostsController {
  constructor(private readonly misskeyHostsService: MisskeyHostsService) { }
  
  @Get('')
  public async getMisskeyHosts(@Res() res: Response): Promise<Response<Result<Array<MisskeyHost>>>> {
    const result = await this.misskeyHostsService.getMisskeyHosts();
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
