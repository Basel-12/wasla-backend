import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeviceId1777542591953 implements MigrationInterface {
    name = 'AddDeviceId1777542591953';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "deviceId" character varying`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deviceId"`);
    }
}
