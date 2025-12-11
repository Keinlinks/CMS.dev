import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1765487529830 implements MigrationInterface {
    name = 'Initial1765487529830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "logoUrl" character varying, "questionText" character varying, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "email_confirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "organizationId" uuid NOT NULL, "role" character varying NOT NULL, CONSTRAINT "CHK_141f8489572db7b527262030ec" CHECK (role IN ('admin', 'editor')), CONSTRAINT "PK_3e103cdf85b7d6cb620b4db0f0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "testimonials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_name" character varying NOT NULL, "client_email" character varying NOT NULL, "organization_id" character varying NOT NULL, "category_id" uuid NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "media_url" character varying, "media_type" character varying, "status" character varying, "stars_rating" bigint, CONSTRAINT "PK_63b03c608bd258f115a0a4a1060" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "organizationId" character varying NOT NULL, "role_asigned" character varying NOT NULL, "token_hashed" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP DEFAULT now(), CONSTRAINT "CHK_dbff443c74fb4f2d17ab5f1481" CHECK (role_asigned IN ('admin', 'editor')), CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3aa71694d99f3e588ee3f83be4" ON "invitations" ("token_hashed") `);
        await queryRunner.query(`CREATE TABLE "testimonial_invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "token" character varying NOT NULL, "categoryId" character varying NOT NULL, "organizationId" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL DEFAULT now(), "used_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_5416fa1619a3d95bf6bc3a786b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3f4181ce4b3ded309d603511c0" ON "testimonial_invitations" ("token") `);
        await queryRunner.query(`CREATE TABLE "testimonial_tags" ("testimonial_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_db7cfa19cf5b6dfe130ee9cbbe1" PRIMARY KEY ("testimonial_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e16e38e005130ecd236b71ca1d" ON "testimonial_tags" ("testimonial_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_455e8e4bfdb14c4628d623c4aa" ON "testimonial_tags" ("tag_id") `);
        await queryRunner.query(`ALTER TABLE "user_organization" ADD CONSTRAINT "FK_29c3c8cc3ea9db22e4a347f4b5a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_organization" ADD CONSTRAINT "FK_7143f31467178a6164a42426c15" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "testimonials" ADD CONSTRAINT "FK_19c046d52add1add9e2ab535d83" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "testimonial_tags" ADD CONSTRAINT "FK_e16e38e005130ecd236b71ca1d7" FOREIGN KEY ("testimonial_id") REFERENCES "testimonials"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "testimonial_tags" ADD CONSTRAINT "FK_455e8e4bfdb14c4628d623c4aa1" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "testimonial_tags" DROP CONSTRAINT "FK_455e8e4bfdb14c4628d623c4aa1"`);
        await queryRunner.query(`ALTER TABLE "testimonial_tags" DROP CONSTRAINT "FK_e16e38e005130ecd236b71ca1d7"`);
        await queryRunner.query(`ALTER TABLE "testimonials" DROP CONSTRAINT "FK_19c046d52add1add9e2ab535d83"`);
        await queryRunner.query(`ALTER TABLE "user_organization" DROP CONSTRAINT "FK_7143f31467178a6164a42426c15"`);
        await queryRunner.query(`ALTER TABLE "user_organization" DROP CONSTRAINT "FK_29c3c8cc3ea9db22e4a347f4b5a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_455e8e4bfdb14c4628d623c4aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e16e38e005130ecd236b71ca1d"`);
        await queryRunner.query(`DROP TABLE "testimonial_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f4181ce4b3ded309d603511c0"`);
        await queryRunner.query(`DROP TABLE "testimonial_invitations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3aa71694d99f3e588ee3f83be4"`);
        await queryRunner.query(`DROP TABLE "invitations"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "testimonials"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "user_organization"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
    }

}
