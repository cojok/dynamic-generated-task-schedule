import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { User } from './user.entity';
import { ConnectorsConnectionDataOffice365 } from '../../connectors/interfaces/connectors-connection-data-office365.interface';

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
    type: 'jsonb',
    name: 'connectionData',
  })
  connectionData: ConnectorsConnectionDataOffice365;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: User['id'];
}
