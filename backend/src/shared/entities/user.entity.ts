import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  /** `@misskeyUserName@misskeyHost` の形式 */
  @PrimaryColumn({ unique: true })
  public id: string;
  
  /** Misskey 認証の中で取得する・変更不可 */
  @Column()
  public misskeyUserName: string;
  
  /** Misskey 認証開始時にユーザが選択する・変更不可 */
  @Column()
  public misskeyHost: string;
  
  /** ユーザ表示名・任意に変更可能 */
  @Column()
  public name: string;
  
  /** 初回は Misskey 認証後に取得・任意に変更可能とする */
  @Column({ nullable: true })
  public avatarUrl: string;
  
  /** Misskey 認証中に発行されたモノを保持しておく */
  @Column({ select: false })
  public token: string;
  
  /** Misskey 認証時に発行されたモノを保持しておく */
  @Column({ select: false })
  public accessToken: string;
  
  /** Misskey 認証時に取得できた値を入れておく */
  @Column({ type: 'json' })
  public misskeyUser: any;
  
  @CreateDateColumn({ type: 'timestamptz' })
  public readonly createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamptz' })
  public readonly updatedAt: Date;
  
  constructor(partial: Partial<UserEntity>) { Object.assign(this, partial); }
}
