import { Response } from 'express';

import { Controller, Get, HttpStatus, Res } from '@nestjs/common';

import { Tree } from '../../common/types/tree';
import { Result } from '../../common/types/result';
import { TreeService } from './tree.service';

@Controller('/api/tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) { }
  
  @Get('')
  public async getRootTree(@Res() res: Response): Promise<Response<Result<Tree>>> {
    const result: Result<Tree> = await this.treeService.getRootTree();
    if(result.error != null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
