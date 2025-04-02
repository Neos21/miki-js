import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { Result } from '../../common/types/result';
import { TreeItem } from '../../common/types/tree-item';

import { TreeService } from './tree.service';

@Controller('/api/tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) { }
  
  /** 指定した親の直下にある要素のみを取得する */
  @Get('children')
  public async getChildren(@Query('parentDocumentId') parentDocumentId: string | undefined, @Res() res: Response): Promise<Response<Result<Array<TreeItem>>>> {
    const result = await this.treeService.getChildren(parentDocumentId);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
  
  @Get('to-root')
  public async getToRoot(@Query('targetDocumentId') targetDocumentId: string, @Res() res: Response): Promise<Response<Result<Array<any>>>> {
    const result = await this.treeService.getToRootWithSiblings(targetDocumentId);
    if(result.error != null) return res.status(result.code ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
