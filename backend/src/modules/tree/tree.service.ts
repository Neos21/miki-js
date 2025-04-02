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
  
  public async getToRoot(targetDocumentId: string): Promise<Result<Array<any>>> {
    const rawDocuments = await this.documentsRepository.query(`
      WITH RECURSIVE path AS (
        SELECT id, uri, title, "parentDocumentId"
        FROM documents
        WHERE id = $1
        UNION ALL
        SELECT "childDocuments".id, "childDocuments".uri, "childDocuments".title, "childDocuments"."parentDocumentId"
        FROM documents "childDocuments"
        INNER JOIN path ON "childDocuments".id::UUID = path."parentDocumentId"::UUID
      )
      SELECT id, uri, title, "parentDocumentId" FROM path;
    `, [targetDocumentId]);
    const documents = rawDocuments.reverse();  // ルートからの順番に並べ替える
    return { result: documents };
  }
  
  public async getToRootWithSiblings(targetDocumentId: string): Promise<Result<Array<any>>> {
    // WITH RECURSIVE で、指定されたドキュメントを起点にルートまでのパスを取得する
    // SELECT 文で、各階層の兄弟要素を取得する
    const rawDocuments = await this.documentsRepository.query(`
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
    const tree = this.buildTreeWithSiblings(rawDocuments, targetDocumentId);
    
    console.log('DOCS', JSON.stringify(rawDocuments, null, '  '));
    console.log('TREE', JSON.stringify(tree, null, '  '));
    return { result: tree };
  }
  
  private buildTreeWithSiblings(documents: any[], targetDocumentId: string): any[] {
    const map = new Map<string, any>();
    const tree: any[] = [];
    
    // すべてのドキュメントをマップに登録する
    documents.forEach(document => {
      map.set(document.id, { id: document.id, uri: document.uri, title: document.title, children: [], isOpened: false });
    });
    
     // ルートから targetDocumentId までのパスを控えておく (階層メニューとして開いた状態にしたいモノ)
    let currentDocumentId = targetDocumentId;
    const documentIdsOpened = new Set<string>();
    while(currentDocumentId != null) {
      documentIdsOpened.add(currentDocumentId);
      const parentDocumentId = documents.find(document => document.id === currentDocumentId).parentDocumentId ?? null;
      currentDocumentId = parentDocumentId;
    }
    
    // ツリーを構築
    documents.forEach(document => {
      // ルートから targetDocumentId までは isOpened: true とする
      if(documentIdsOpened.has(document.id)) {
        map.get(document.id).isOpened = true;
      }
      
      if(document.parentDocumentId != null) {
        // 親の children に兄弟要素を追加する
        map.get(document.parentDocumentId).children.push(map.get(document.id));
      }
      else {
        // ルート要素として追加する
        tree.push(map.get(document.id));
      }
    });
    
    return tree;
  }
}
