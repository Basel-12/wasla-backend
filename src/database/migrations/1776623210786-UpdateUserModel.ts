import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserModel1776623210786 implements MigrationInterface {
    name = 'UpdateUserModel1776623210786';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`,
        );
    }
}
