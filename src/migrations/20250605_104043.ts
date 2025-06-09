import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "countries" ADD COLUMN "currency_name" varchar NOT NULL;
  ALTER TABLE "countries" ADD COLUMN "currency_code" varchar NOT NULL;
  ALTER TABLE "countries" ADD COLUMN "currency_value" numeric NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "countries" DROP COLUMN IF EXISTS "currency_name";
  ALTER TABLE "countries" DROP COLUMN IF EXISTS "currency_code";
  ALTER TABLE "countries" DROP COLUMN IF EXISTS "currency_value";`)
}
