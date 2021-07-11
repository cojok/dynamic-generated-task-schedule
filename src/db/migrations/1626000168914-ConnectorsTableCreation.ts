/* eslint-disable class-methods-use-this */
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ConnectorsTableCreation1626000168914
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'connectors',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'client_secret',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'add_url',
            type: 'varchar',
            length: '55',
            isNullable: false,
          },
          {
            name: 'graph_url',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'client_id',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'tenant_id',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'userIdId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'connectors',
      new TableForeignKey({
        columnNames: ['userIdId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('connectors');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userIdId') !== -1,
    );
    await queryRunner.dropForeignKey('connectors', foreignKey);
    await queryRunner.dropTable('connectors');
  }
}
