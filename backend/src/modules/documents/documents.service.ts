import { Repository } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Document } from '../../common/types/document';
import { Result } from '../../common/types/result';
import { DocumentEntity } from '../../shared/entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(@InjectRepository(DocumentEntity) private readonly documentsRepository: Repository<DocumentEntity>) { }
  
  public async createDocument(document: Document): Promise<Result<Document>> {
    try {
      const createdDocument: Document = await this.documentsRepository.save(document);
      return { result: createdDocument };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  public async getDocument(id: string): Promise<Result<Document>> {
    try {
      const document: Document = await this.documentsRepository.findOneByOrFail({ id });  // Throws
      return { result: document };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
