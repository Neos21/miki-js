import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  /** `@misskeyUserName@misskeyHost` の形式 */
  @PrimaryColumn({ unique: true })
  public id: string;
  
  /** MiAuth より取得・変更不可 */
  @Column()
  public misskeyUserName: string;
  
  /** MiAuth より取得・変更不可 */
  @Column()
  public misskeyHost: string;
  
  /** MiAuth の API を叩く時に使用する・変更不可 */
  @Column({ default: 'https://' })
  public misskeyHostProtocol: 'https://' | 'http://';
  
  /** パスワードハッシュ・デフォルトでは SELECT しても取得できないようにする */
  @Column({ select: false })
  public passwordHash: string;
  
  /** ユーザ表示名・任意に変更可能 */
  @Column()
  public name: string;
  
  /** 初回は MiAuth より取得・任意に変更可能 */
  @Column({ nullable: true })
  public avatarUrl: string;
  
  /** MiAuth で使用したモノを保持する */
  @Column()
  public sessionId: string;
  
  /** MiAuth で発行したモノを保持する */
  @Column()
  public token: string;
  
  /** MiAuth の Check API で取得できた値を入れる */
  @Column({ type: 'json' })
  public misskeyUser: any;
  
  @CreateDateColumn({ type: 'timestamptz' })
  public readonly createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamptz' })
  public readonly updatedAt: Date;
  
  constructor(partial: Partial<UserEntity>) { Object.assign(this, partial); }
}
