import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('misskeyHosts')
export class MisskeyHostEntity {
  @PrimaryColumn({ unique: true })
  public id: number;
  
  @Column({ unique: true })
  public host: string;
  
  @Column({ default: 'https://' })
  public protocol: 'https://' | 'http://';
  
  constructor(partial: Partial<MisskeyHostEntity>) { Object.assign(this, partial); }
}
