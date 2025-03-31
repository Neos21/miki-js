
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Result } from '../../common/types/result';
import { TreeItem } from '../../common/types/tree-item';
import { DocumentEntity } from '../../shared/entities/document.entity';

@Injectable()
export class TreeService {
  constructor(@InjectRepository(DocumentEntity) private readonly documentsRepository: Repository<DocumentEntity>) { }
  
  public async getTree(parentDocumentId: string | undefined): Promise<Result<Array<TreeItem>>> {
    try {
      const documents: Array<DocumentEntity> = await this.documentsRepository.find({
        where: {
          parentDocumentId: parentDocumentId ?? IsNull()
        }
      });
      const tree: Array<TreeItem> = documents.map(document => ({
        id      : document.id,
        uri     : document.uri,
        title   : document.title,
        children: [],
        isOpened: false
      }));
      return { result: tree };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
