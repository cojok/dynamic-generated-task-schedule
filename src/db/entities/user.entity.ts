import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  // OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
// import { Connectors } from './connectors.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 55 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  @Index('email_1', { unique: true })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  @Index('username_1', { unique: true })
  username: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  // @OneToMany(() => Connectors, (connectors) => connectors.userId)
  // connectors: Connectors[];
}
