import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
  
  /** `/path/to/this-page` の場合の `this-page` 部分 */
  @Column()
  public uri: string;
  
  @Column()
  public title: string;
  
  @Column({ type: 'text' })
  public content: string;
  
  @Column({ nullable: true })
  public parentDocumentId: string;
  
  @Column({ type: 'json' })
  public documentStructure: any;
  
  @Column({ type: 'integer' })
  public version: number;
  
  @Column()
  public createdUserId: string;
  
  @Column()
  public updatedUserId: string;
  
  @CreateDateColumn({ type: 'timestamptz' })
  public readonly createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamptz' })
  public readonly updatedAt: Date;
  
  constructor(partial: Partial<DocumentEntity>) { Object.assign(this, partial); }
}
