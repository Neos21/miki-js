import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { MisskeyHost } from '../../../common/types/misskey-host';
import { Result } from '../../../common/types/result';
import { JwtAuthGuard } from '../jwt-auth.guard';

import { AdminMisskeyHostsService } from './admin-misskey-hosts.service';

@Controller('/api/admin/misskey-hosts')
export class AdminMisskeyHostsController {
  constructor(private readonly adminMisskeyHostsService: AdminMisskeyHostsService) { }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async updateAllMisskeyHosts(@Body() misskeyHosts: Array<MisskeyHost>, @Res() res: Response): Promise<Response<Result<Array<MisskeyHost>>>> {
    const result = await this.adminMisskeyHostsService.updateAllMisskeyHosts(misskeyHosts);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
