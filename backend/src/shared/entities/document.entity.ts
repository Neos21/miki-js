import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  public id: string;
  
  /** `/path/to/this-page` の場合の `this-page` 部分 */
  @Column({ name: 'uri' })
  public uri: string;
  
  @Column({ name: 'title' })
  public title: string;
  
  @Column({ name: 'content', type: 'text' })
  public content: string;
  
  @Column({ name: 'parent_document_id', nullable: true })
  public parentDocumentId: string;
  
  @Column({ name: 'document_structure', type: 'json' })
  public documentStructure: any;
  
  @Column({ name: 'version', type: 'integer' })
  public version: number;
  
  @Column({ name: 'created_user_id' })
  public createdUserId: string;
  
  @Column({ name: 'updated_user_id' })
  public updatedUserId: string;
  
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public readonly createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public readonly updatedAt: Date;
  
  constructor(partial: Partial<DocumentEntity>) { Object.assign(this, partial); }
}
