import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { Result } from '../../common/types/result';
import { TreeItem } from '../../common/types/tree-item';

import { TreeService } from './tree.service';

@Controller('/api/tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) { }
  
  @Get('')
  public async getRootTree(@Query('parentDocumentId') parentDocumentId: string | undefined, @Res() res: Response): Promise<Response<Result<Array<TreeItem>>>> {
    const result = await this.treeService.getTree(parentDocumentId);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
