import { Response } from 'express';

import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';

import { Document } from '../../common/types/document';
import { Result } from '../../common/types/result';
import { DocumentsService } from './documents.service';

@Controller('/api/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }
  
  @Post('')
  public async createDocument(@Body() document: Document, @Res() res: Response): Promise<Response<Result<boolean>>> {
    const result: Result<boolean> = await this.documentsService.createDocument(document);
    if(result.error != null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.CREATED).json(result);
  }
  
  @Get(':id')
  public async getDocument(@Param('id') id: string, @Res() res: Response): Promise<Response<Result<Document>>> {
    const result: Result<Document> = await this.documentsService.getDocument(id);
    if(result.error != null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    
    return res.status(HttpStatus.OK).json(result);
  }
}
