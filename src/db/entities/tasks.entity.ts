import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TaskConfiguration } from '../../task/interfaces/taskConfiguration.interface';

@Entity()
export class Tasks {
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
    type: 'jsonb',
    name: 'connectionData',
  })
  connectionData: TaskConfiguration;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
