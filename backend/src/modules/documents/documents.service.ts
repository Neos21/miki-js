import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { isEmptyString } from '../../common/helpers/is-empty-string';
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
  
  public async findDocumentByFullPath(fullPath: string): Promise<Result<Document>> {
    try {
      const lastUri = fullPath.split('/').pop();
      const documentEntities: Array<DocumentEntity> = await this.documentsRepository.query(`
        WITH RECURSIVE hierarchy AS (
          SELECT id, uri, "parentDocumentId"
          FROM documents
          WHERE uri = $1
          UNION ALL
          SELECT "childDocuments".id, "childDocuments".uri, "childDocuments"."parentDocumentId"
          FROM documents "childDocuments"
          INNER JOIN hierarchy ON "childDocuments".id::UUID = hierarchy."parentDocumentId"::UUID
        )
        SELECT * FROM documents
        WHERE id IN (SELECT id FROM hierarchy)
        ORDER BY "parentDocumentId" ASC NULLS FIRST;
      `, [lastUri]);  // NOTE : キャメルケースで SQL を書くことで Entity クラスとの変換を省く
      if(documentEntities == null || documentEntities.length === 0) return { error: 'The Document Not Found (Last URI Does Not Exist)', code: HttpStatus.NOT_FOUND };
      
      // フルパスが完全一致する Document を探す
      const documentEntity = documentEntities.find(documentEntity => this.getFullPath(documentEntity, documentEntities) === fullPath);
      if(documentEntity == null) return { error: 'The Document Not Found (Full Path Does Not Match)', code: HttpStatus.NOT_FOUND };
      
      return { result: documentEntity as Document };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  public async saveDocumentById(id: string, document: Document): Promise<Result<Document>> {
    try {
      const targetDocument = await this.documentsRepository.findOneBy({ id });
      if(targetDocument == null) return { error: 'The Document ID Does Not Exist', code: HttpStatus.BAD_REQUEST };
      
      // DB のバージョンと同じ値でない場合は競合の恐れがあるため更新しない
      if(document.version !== targetDocument.version) return { error: 'Version Mismatch', code: HttpStatus.BAD_REQUEST };
      
      // バージョンをインクリメントして保存する
      document.version = document.version + 1;
      const updatedDocument = await this.documentsRepository.save(document);
      return { result: updatedDocument };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  private getFullPath(documentEntity: DocumentEntity, documentEntities: Array<DocumentEntity>): string {
    let fullPath = documentEntity.uri;
    let currentDocumentEntity = documentEntity;
    while(!isEmptyString(currentDocumentEntity.parentDocumentId)) {
      const parentDocumentEntity = documentEntities.find(document => document.id === currentDocumentEntity.parentDocumentId);
      if(parentDocumentEntity == null) break;
      fullPath = `${parentDocumentEntity.uri}/${fullPath}`;
      currentDocumentEntity = parentDocumentEntity;
    }
    return fullPath;
  }
}
