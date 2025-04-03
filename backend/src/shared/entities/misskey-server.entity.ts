import { Column, Entity, PrimaryColumn } from 'typeorm';

/** サインアップ・ログインを許可する Misskey サーバ定義 */
@Entity('misskeyServer')
export class MisskeyServerEntity {
  /** セレクトボックスでの表示順を兼ねている */
  @PrimaryColumn({ unique: true })
  public id: number;
  
  @Column({ unique: true })
  public host: string;
  
  /** 通常 Select できないようにしておく */
  @Column({ nullable: true, select: false })
  public appSecret: string;
  
  constructor(partial: Partial<MisskeyServerEntity>) { Object.assign(this, partial); }
}
