import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('misskey_hosts')
export class MisskeyHostEntity {
  @PrimaryColumn({ name: 'host', unique: true })
  public host: string;
  
  @Column({ name: 'protocol', default: 'https://' })
  public protocol: 'https://' | 'http://';
  
  constructor(partial: Partial<MisskeyHostEntity>) { Object.assign(this, partial); }
}
