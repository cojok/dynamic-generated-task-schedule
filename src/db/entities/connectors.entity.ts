import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { User } from './user.entity';
@Entity()
export class Connectors {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Column({
    nullable: false,
    type: 'varchar',
    name: 'client_id',
    unique: true,
  })
  client_id: string;

  @Column({
    nullable: false,
    type: 'varchar',
    name: 'client_secret',
    unique: true,
  })
  client_secret: string;

  @Column({
    nullable: false,
    type: 'varchar',
    name: 'tenant_id',
  })
  tenant_id: string;

  @Column({
    nullable: false,
    type: 'varchar',
    name: 'aad_url',
  })
  aad_url: string;

  @Column({
    nullable: false,
    type: 'varchar',
    name: 'graph_url',
  })
  graph_url: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User, (user: User) => user.connectors)
  user_id: User['id'];
}
