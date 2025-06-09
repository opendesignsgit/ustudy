import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "countries" 
      ADD COLUMN IF NOT EXISTS "currency_name" varchar NOT NULL DEFAULT 'Ringgit',
      ADD COLUMN IF NOT EXISTS "currency_code" varchar NOT NULL DEFAULT 'MYR',
      ADD COLUMN IF NOT EXISTS "currency_value" numeric NOT NULL DEFAULT 20.27;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "countries" 
      DROP COLUMN IF EXISTS "currency_name",
      DROP COLUMN IF EXISTS "currency_code",
      DROP COLUMN IF EXISTS "currency_value";
  `)
}