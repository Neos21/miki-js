import { Repository } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Document } from '../../common/types/document';
import { Result } from '../../common/types/result';
import { DocumentEntity } from '../../shared/entities/document.entity';
import { isEmptyString } from '../../common/helpers/is-empty-string';
import { snakeToCamelCaseObject } from '../../common/helpers/convert-case';

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
  
  public async getDocumentByFullPath(fullPath: string): Promise<Result<Document>> {
    try {
      const lastUri = fullPath.split('/').pop();
      const rawDocumentEntities: Array<any> = await this.documentsRepository.query(`
        WITH RECURSIVE hierarchy AS (
          SELECT id, uri, parent_document_id
          FROM documents
          WHERE uri = $1
          UNION ALL
          SELECT child_documents.id, child_documents.uri, child_documents.parent_document_id
          FROM documents child_documents
          INNER JOIN hierarchy ON child_documents.id::UUID = hierarchy.parent_document_id::UUID
        )
        SELECT * FROM documents
        WHERE id IN (SELECT id FROM hierarchy)
        ORDER BY parent_document_id NULLS FIRST;
      `, [lastUri]);  // この時点ではスネークケースの生オブジェクトが取れる点に注意
      if(rawDocumentEntities == null || rawDocumentEntities.length === 0) return { error: 'The Document Not Found (Last URI Does Not Exist)', code: HttpStatus.NOT_FOUND };
      
      // フルパスが完全一致する Document を探す
      const documentEntities: Array<DocumentEntity> = snakeToCamelCaseObject(rawDocumentEntities) as Array<DocumentEntity>;
      const documentEntity = documentEntities.find(documentEntity => this.getFullPath(documentEntity, documentEntities) === fullPath);
      if(documentEntity == null) return { error: 'The Document Not Found (Full Path Does Not Match)', code: HttpStatus.NOT_FOUND };
      
      return { result: documentEntity as Document };
    }
    catch(error) {
      return { error, code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
  
  public async putDocumentById(id: string, document: Document): Promise<Result<Document>> {
    try {
      const targetDocument = await this.documentsRepository.findOneBy({ id });
      if(targetDocument == null) return { error: 'The Document ID Does Not Exist', code: HttpStatus.BAD_REQUEST };
      
      // DB のバージョンと同じ値でない場合は競合の恐れがあるため更新しない
      if(document.version !== targetDocument.version) return { error: 'Version Mimatch', code: HttpStatus.BAD_REQUEST };
      
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
