import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1781151815670 implements MigrationInterface {
    name = ' $npmConfigName1781151815670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorite_words" ("id" SERIAL NOT NULL, "word" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_a8b8e2d030acd3c21d2a6f56214" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, "title_translations" jsonb, "body_translations" jsonb, "data" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_notifications" ("id" SERIAL NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "readAt" TIMESTAMP, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "notificationId" integer, CONSTRAINT "PK_569622b0fd6e6ab3661de985a2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" SERIAL NOT NULL, "otp" character varying NOT NULL, "reason" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_preferredlanguage_enum" AS ENUM('ar', 'en')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone" character varying, "email" character varying NOT NULL, "password" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "provider" character varying NOT NULL DEFAULT 'local', "providerId" character varying, "isVerified" boolean NOT NULL DEFAULT false, "preferredLanguage" "public"."users_preferredlanguage_enum" NOT NULL DEFAULT 'ar', "avatar" character varying NOT NULL DEFAULT 'avatar.png', "isActive" boolean NOT NULL DEFAULT true, "firebaseToken" character varying, "deviceId" character varying, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "analytics_events" ("id" SERIAL NOT NULL, "label" character varying(100) NOT NULL, "confidence" double precision NOT NULL, "session_id" character varying(64), "ts" bigint NOT NULL, "userId" integer, CONSTRAINT "PK_5d643d67a09b55653e98616f421" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_16bda4a25ab64df21201eb0777" ON "analytics_events" ("ts") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a6943770a0e7335b8c9b401aa" ON "analytics_events" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user_favorite_words" ADD CONSTRAINT "FK_d4cb65dea622d32475a339f1a9a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_notifications" ADD CONSTRAINT "FK_cb22b968fe41a9f8b219327fde8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_notifications" ADD CONSTRAINT "FK_01a2c65f414d36cfe6f5d950fb2" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "otps" ADD CONSTRAINT "FK_82b0deb105275568cdcef2823eb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "analytics_events" ADD CONSTRAINT "FK_5a6943770a0e7335b8c9b401aa6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "analytics_events" DROP CONSTRAINT "FK_5a6943770a0e7335b8c9b401aa6"`);
        await queryRunner.query(`ALTER TABLE "otps" DROP CONSTRAINT "FK_82b0deb105275568cdcef2823eb"`);
        await queryRunner.query(`ALTER TABLE "user_notifications" DROP CONSTRAINT "FK_01a2c65f414d36cfe6f5d950fb2"`);
        await queryRunner.query(`ALTER TABLE "user_notifications" DROP CONSTRAINT "FK_cb22b968fe41a9f8b219327fde8"`);
        await queryRunner.query(`ALTER TABLE "user_favorite_words" DROP CONSTRAINT "FK_d4cb65dea622d32475a339f1a9a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a6943770a0e7335b8c9b401aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16bda4a25ab64df21201eb0777"`);
        await queryRunner.query(`DROP TABLE "analytics_events"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_preferredlanguage_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TABLE "user_notifications"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "user_favorite_words"`);
    }

}
