import { Response } from 'express';

import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';

import { TreeItem } from '../../common/types/tree-item';
import { Result } from '../../common/types/result';
import { TreeService } from './tree.service';

@Controller('/api/tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) { }
  
  @Get('')
  public async getRootTree(@Query('parent_document_id') parentDocumentId: string | undefined, @Res() res: Response): Promise<Response<Result<Array<TreeItem>>>> {
    const result: Result<Array<TreeItem>> = await this.treeService.getTree(parentDocumentId);
    if(result.error != null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
