import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Remove old FKs and indexes before data migration
  await db.execute(sql`
    ALTER TABLE "courses" DROP CONSTRAINT IF EXISTS "courses_study_year_id_study_years_id_fk";
    ALTER TABLE "_courses_v" DROP CONSTRAINT IF EXISTS "_courses_v_version_study_year_id_study_years_id_fk";
    DROP INDEX IF EXISTS "courses_study_year_idx";
    DROP INDEX IF EXISTS "_courses_v_version_version_study_year_idx";
    ALTER TABLE "courses_rels" ADD COLUMN IF NOT EXISTS "study_years_id" integer;
    ALTER TABLE "_courses_v_rels" ADD COLUMN IF NOT EXISTS "study_years_id" integer;
    DO $$ BEGIN
      ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_study_years_fk" FOREIGN KEY ("study_years_id") REFERENCES "public"."study_years"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_study_years_fk" FOREIGN KEY ("study_years_id") REFERENCES "public"."study_years"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    CREATE INDEX IF NOT EXISTS "courses_rels_study_years_id_idx" ON "courses_rels" USING btree ("study_years_id");
    CREATE INDEX IF NOT EXISTS "_courses_v_rels_study_years_id_idx" ON "_courses_v_rels" USING btree ("study_years_id");
  `);

  // 2. DATA MIGRATION: Insert into join tables, setting path to 'studyYear' and order to 1
  await db.execute(sql`
    INSERT INTO "courses_rels" (
      "parent_id",
      "study_years_id",
      "path",
      "order"
    )
    SELECT
      id,
      study_year_id,
      'studyYear',    -- path as requested
      1               -- order as requested
    FROM "courses"
    WHERE study_year_id IS NOT NULL
    ON CONFLICT DO NOTHING;
  `);

  await db.execute(sql`
    INSERT INTO "_courses_v_rels" (
      "parent_id",
      "study_years_id",
      "path",
      "order"
    )
    SELECT
      id,
      version_study_year_id,
      'studyYear',    -- path as requested
      1               -- order as requested
    FROM "_courses_v"
    WHERE version_study_year_id IS NOT NULL
    ON CONFLICT DO NOTHING;
  `);

  // 3. Remove old columns after moving data
  await db.execute(sql`
    ALTER TABLE "courses" DROP COLUMN IF EXISTS "study_year_id";
    ALTER TABLE "_courses_v" DROP COLUMN IF EXISTS "version_study_year_id";
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // 1. Restore schema
  await db.execute(sql`
    ALTER TABLE "courses_rels" DROP CONSTRAINT IF EXISTS "courses_rels_study_years_fk";
    ALTER TABLE "_courses_v_rels" DROP CONSTRAINT IF EXISTS "_courses_v_rels_study_years_fk";
    DROP INDEX IF EXISTS "courses_rels_study_years_id_idx";
    DROP INDEX IF EXISTS "_courses_v_rels_study_years_id_idx";
    ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "study_year_id" integer;
    ALTER TABLE "_courses_v" ADD COLUMN IF NOT EXISTS "version_study_year_id" integer;
    DO $$ BEGIN
      ALTER TABLE "courses" ADD CONSTRAINT "courses_study_year_id_study_years_id_fk" FOREIGN KEY ("study_year_id") REFERENCES "public"."study_years"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_study_year_id_study_years_id_fk" FOREIGN KEY ("version_study_year_id") REFERENCES "public"."study_years"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    CREATE INDEX IF NOT EXISTS "courses_study_year_idx" ON "courses" USING btree ("study_year_id");
    CREATE INDEX IF NOT EXISTS "_courses_v_version_version_study_year_idx" ON "_courses_v" USING btree ("version_study_year_id");
  `);

  // 2. DATA DOWN: Restore a single study_year_id from join tables
  await db.execute(sql`
    UPDATE "courses" SET "study_year_id" = sub.study_years_id
    FROM (
      SELECT parent_id, MIN(study_years_id) AS study_years_id
      FROM "courses_rels"
      WHERE study_years_id IS NOT NULL
      GROUP BY parent_id
    ) AS sub
    WHERE "courses".id = sub.parent_id;
  `);

  await db.execute(sql`
    UPDATE "_courses_v" SET "version_study_year_id" = sub.study_years_id
    FROM (
      SELECT parent_id, MIN(study_years_id) AS study_years_id
      FROM "_courses_v_rels"
      WHERE study_years_id IS NOT NULL
      GROUP BY parent_id
    ) AS sub
    WHERE "_courses_v".id = sub.parent_id;
  `);

  // 3. Clean up join columns
  await db.execute(sql`
    ALTER TABLE "courses_rels" DROP COLUMN IF EXISTS "study_years_id";
    ALTER TABLE "_courses_v_rels" DROP COLUMN IF EXISTS "study_years_id";
  `);
}