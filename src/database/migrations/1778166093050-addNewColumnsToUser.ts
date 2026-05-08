import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumnsToUser1778166093050 implements MigrationInterface {
    name = 'AddNewColumnsToUser1778166093050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_preferredlanguage_enum" AS ENUM('ar', 'en')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "preferredLanguage" "public"."users_preferredlanguage_enum" NOT NULL DEFAULT 'ar'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying NOT NULL DEFAULT 'avatar.png'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "preferredLanguage"`);
        await queryRunner.query(`DROP TYPE "public"."users_preferredlanguage_enum"`);
    }

}
