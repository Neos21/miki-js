import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Result } from '../../common/types/result';
import { TreeItem } from '../../common/types/tree-item';
import { DocumentEntity } from '../../shared/entities/document.entity';

@Injectable()
export class TreeService {
  constructor(@InjectRepository(DocumentEntity) private readonly documentsRepository: Repository<DocumentEntity>) { }
  
  public async getChildren(parentDocumentId: string | undefined): Promise<Result<Array<TreeItem>>> {
    try {
      const documents = await this.documentsRepository.find({
        select: ['id', 'uri', 'title'],
        where: {
          parentDocumentId: parentDocumentId ?? IsNull()
        },
        order: {
          title: 'ASC'
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
  
  public async getToRootWithSiblings(targetDocumentId: string): Promise<Result<Array<any>>> {
    // WITH RECURSIVE で、指定されたドキュメントを起点にルートまでのパスを取得する
    // SELECT 文で、各階層の兄弟要素を取得する
    const documentEntities: Array<DocumentEntity> = await this.documentsRepository.query(`
      WITH RECURSIVE path AS (
        SELECT id, uri, title, "parentDocumentId"
        FROM documents
        WHERE id = $1
        UNION ALL
        SELECT "childDocuments".id, "childDocuments".uri, "childDocuments".title, "childDocuments"."parentDocumentId"
        FROM documents "childDocuments"
        INNER JOIN path ON "childDocuments".id::UUID = path."parentDocumentId"::UUID
      )
      SELECT "siblingDocuments".id, "siblingDocuments".uri, "siblingDocuments".title, "siblingDocuments"."parentDocumentId"
      FROM documents "siblingDocuments"
      WHERE "siblingDocuments"."parentDocumentId" IN (SELECT "parentDocumentId" FROM path)
      OR "siblingDocuments".id IN (SELECT id FROM path)
      ORDER BY COALESCE("siblingDocuments"."parentDocumentId"::UUID, "siblingDocuments".id), "siblingDocuments".id;
    `, [targetDocumentId]);
  
    // ツリー構造を組み立てる
    const tree = this.buildTreeWithSiblings(documentEntities, targetDocumentId);
    
    console.log('DOCS', JSON.stringify(documentEntities, null, '  '));  // TODO
    console.log('TREE', JSON.stringify(tree, null, '  '));
    return { result: tree };
  }
  
  private buildTreeWithSiblings(documentEntities: Array<DocumentEntity>, targetDocumentId: string): Array<TreeItem> {
    const documentEntitiesMap = new Map<string, TreeItem>();
    const tree: Array<TreeItem> = [];
    
    // すべてのドキュメントをマップに登録する
    documentEntities.forEach(documentEntity => {
      documentEntitiesMap.set(documentEntity.id, { id: documentEntity.id, uri: documentEntity.uri, title: documentEntity.title, children: [], isOpened: false });
    });
    
     // ルートから targetDocumentId までのパスを控えておく (階層メニューとして開いた状態にしたいモノ)
    let currentDocumentId: string | null = targetDocumentId;
    const documentIdsToOpen = new Set<string>();
    while(currentDocumentId != null) {
      documentIdsToOpen.add(currentDocumentId);
      const parentDocumentId = documentEntities.find(document => document.id === currentDocumentId)?.parentDocumentId ?? null;
      currentDocumentId = parentDocumentId;
    }
    
    // ツリーを構築する
    documentEntities.forEach(documentEntity => {
      // ルートから targetDocumentId までは isOpened: true とする
      if(documentIdsToOpen.has(documentEntity.id)) {
        documentEntitiesMap.get(documentEntity.id)!.isOpened = true;
      }
      
      if(documentEntity.parentDocumentId != null) {
        // 親の children に兄弟要素を追加する
        documentEntitiesMap.get(documentEntity.parentDocumentId)!.children!.push(documentEntitiesMap.get(documentEntity.id)!);
      }
      else {
        // ルート要素として追加する
        tree.push(documentEntitiesMap.get(documentEntity.id)!);
      }
    });
    
    return tree;
  }
}
