import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { MisskeyServer } from '../../../common/types/misskey-server';
import { Result } from '../../../common/types/result';
import { JwtAuthGuard } from '../jwt-auth.guard';

import { AdminMisskeyServersService } from './admin-misskey-servers.service';

@Controller('/api/admin/misskey-servers')
export class AdminMisskeyServersController {
  constructor(private readonly adminMisskeyServersService: AdminMisskeyServersService) { }
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  public async updateAllMisskeyServers(@Body() misskeyServers: Array<MisskeyServer>, @Res() res: Response): Promise<Response<Result<Array<MisskeyServer>>>> {
    const result = await this.adminMisskeyServersService.updateAllMisskeyServers(misskeyServers);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
