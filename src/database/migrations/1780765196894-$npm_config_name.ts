import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1780765196894 implements MigrationInterface {
    name = ' $npmConfigName1780765196894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorite_words" ("id" SERIAL NOT NULL, "word" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_a8b8e2d030acd3c21d2a6f56214" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_favorite_words" ADD CONSTRAINT "FK_d4cb65dea622d32475a339f1a9a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorite_words" DROP CONSTRAINT "FK_d4cb65dea622d32475a339f1a9a"`);
        await queryRunner.query(`DROP TABLE "user_favorite_words"`);
    }

}
