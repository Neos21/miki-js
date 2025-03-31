import { Repository } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Document } from '../../common/types/document';
import { Result } from '../../common/types/result';
import { DocumentEntity } from '../../shared/entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(@InjectRepository(DocumentEntity) private readonly documentsRepository: Repository<DocumentEntity>) { }
  
  public async createDocument(document: Document): Promise<Result<boolean>> {
    try {
      // 同じ階層に同じ URI のドキュメントが既にあったら重複するので作成させない
      const targetDocument = await this.documentsRepository.findOneBy({ parentDocumentId: document.parentDocumentId, uri: document.uri });
      if(targetDocument != null) return { error: 'The Document Already Exists', code: HttpStatus.BAD_REQUEST };
      
      await this.documentsRepository.insert(document);
      return { result: true };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  public async getDocument(id: string): Promise<Result<Document>> {
    try {
      const document: Document = await this.documentsRepository.findOneByOrFail({ id });
      return { result: document };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
