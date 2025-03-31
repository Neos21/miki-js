import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ name: 'id', unique: true })
  public id: string;
  
  @Column({ name: 'misskey_user_name' })
  public misskeyUserName: string;
  
  @Column({ name: 'misskey_host' })
  public misskeyHost: string;
  
  @Column({ name: 'name' })
  public name: string;
  
  @Column({ name: 'avatar_url', nullable: true })
  public avatarUrl: string;
  
  @Column({ name: 'session_id' })
  public sessionId: string;
  
  @Column({ name: 'token' })
  public token: string;
  
  @Column({ name: 'misskey_user', type: 'json' })
  public misskeyUser: any;
  
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public readonly createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public readonly updatedAt: Date;
  
  constructor(partial: Partial<UserEntity>) { Object.assign(this, partial); }
}
