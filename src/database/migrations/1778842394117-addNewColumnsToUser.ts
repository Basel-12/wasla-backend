import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewColumnsToUser1778842394117 implements MigrationInterface {
    name = 'AddNewColumnsToUser1778842394117';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "provider" character varying NOT NULL DEFAULT 'local'`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "providerId" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "providerId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "provider"`);
    }
}
