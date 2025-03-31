import { Repository } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Result } from '../../common/types/result';
import { Tree } from '../../common/types/tree';
import { DocumentEntity } from '../../shared/entities/document.entity';

@Injectable()
export class TreeService {
  constructor(@InjectRepository(DocumentEntity) private readonly documentsRepository: Repository<DocumentEntity>) { }
  
  public async getRootTree(): Promise<Result<Tree>> {
    try {
      const documents: Array<DocumentEntity> = await this.documentsRepository.findBy({ parentDocumentId: undefined });
      const tree: Tree = documents.map(document => ({
        id      : document.id,
        uri     : document.uri,
        title   : document.title,
        children: []
      }));
      return { result: tree };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
