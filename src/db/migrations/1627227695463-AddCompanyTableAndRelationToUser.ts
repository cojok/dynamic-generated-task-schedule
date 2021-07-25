/* eslint-disable class-methods-use-this */
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCompanyTableAndRelationToUser1627227695463
  implements MigrationInterface
{
  name = 'AddCompanyTableAndRelationToUser1627227695463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "phone" integer NOT NULL, "address" jsonb NOT NULL, "accountStatus" character varying, "paymentId" character varying, "planId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_27311acabf78b3edc061a017210" PRIMARY KEY ("id"))`,
    );
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'companyId',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['companyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'company',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "public"."company"`);
    const table = await queryRunner.getTable('user');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('companyId') !== -1,
    );
    await queryRunner.dropForeignKey('user', foreignKey);
    await queryRunner.dropColumn('user', 'companyId');
  }
}
