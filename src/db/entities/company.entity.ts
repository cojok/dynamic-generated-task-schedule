import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Address } from '../../shared/interfaces/address.interface';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 255,
    name: 'name',
  })
  name: string;

  @Column({
    nullable: false,
    type: 'int',
    name: 'phone',
  })
  phone: number;

  @Column({
    nullable: false,
    type: 'jsonb',
    name: 'address',
  })
  address: Address;

  @Column({
    nullable: true,
    type: 'varchar',
    name: 'accountStatus',
  })
  accountStatus: string;

  @Column({
    nullable: true,
    type: 'varchar',
    name: 'paymentId',
  })
  paymentId: string;

  @Column({
    nullable: true,
    type: 'varchar',
    name: 'planId',
  })
  planId: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
