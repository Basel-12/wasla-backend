import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1776540391484 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // baseline migration
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
