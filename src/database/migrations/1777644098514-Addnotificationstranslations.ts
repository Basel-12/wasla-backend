import { MigrationInterface, QueryRunner } from 'typeorm';

export class Addnotificationstranslations1777644098514 implements MigrationInterface {
    name = 'Addnotificationstranslations1777644098514';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD "title_translations" jsonb`,
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" ADD "body_translations" jsonb`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP COLUMN "body_translations"`,
        );
        await queryRunner.query(
            `ALTER TABLE "notifications" DROP COLUMN "title_translations"`,
        );
    }
}
