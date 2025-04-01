import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  /** `@misskeyUserName@misskeyHost` の形式 */
  @PrimaryColumn({ name: 'id', unique: true })
  public id: string;
  
  /** MiAuth より取得・変更不可 */
  @Column({ name: 'misskey_user_name' })
  public misskeyUserName: string;
  
  /** MiAuth より取得・変更不可 */
  @Column({ name: 'misskey_host' })
  public misskeyHost: string;
  
  /** MiAuth の API を叩く時に使用する・変更不可 */
  @Column({ name: 'misskey_host_protocol', default: 'https://' })
  public misskeyHostProtocol: 'http://' | 'https://';
  
  /** パスワードハッシュ・デフォルトでは SELECT しても取得できないようにする */
  @Column({ name: 'password_hash', select: false })
  public passwordHash: string;
  
  /** ユーザ表示名・任意に変更可能 */
  @Column({ name: 'name' })
  public name: string;
  
  /** 初回は MiAuth より取得・任意に変更可能 */
  @Column({ name: 'avatar_url', nullable: true })
  public avatarUrl: string;
  
  /** MiAuth で使用したモノを保持する */
  @Column({ name: 'session_id' })
  public sessionId: string;
  
  /** MiAuth で発行したモノを保持する */
  @Column({ name: 'token' })
  public token: string;
  
  /** MiAuth の Check API で取得できた値を入れる */
  @Column({ name: 'misskey_user', type: 'json' })
  public misskeyUser: any;
  
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public readonly createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public readonly updatedAt: Date;
  
  constructor(partial: Partial<UserEntity>) { Object.assign(this, partial); }
}
