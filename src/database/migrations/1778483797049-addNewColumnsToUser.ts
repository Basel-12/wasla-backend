import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumnsToUser1778483797049 implements MigrationInterface {
    name = 'AddNewColumnsToUser1778483797049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    }

}
