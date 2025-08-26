import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Check if university_templates table exists, create if not
  const universityTemplatesExists = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'university_templates'
    );
  `);

  if (!universityTemplatesExists[0]?.exists) {
    await payload.db.drizzle.execute(sql`
      CREATE TABLE IF NOT EXISTS "university_templates" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" varchar NOT NULL,
        "description" text,
        "preview_image_id" integer,
        "status" varchar DEFAULT 'draft',
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );
    `);

    await payload.db.drizzle.execute(sql`
      CREATE INDEX IF NOT EXISTS "university_templates_updated_at_idx" ON "university_templates" ("updated_at");
      CREATE INDEX IF NOT EXISTS "university_templates_created_at_idx" ON "university_templates" ("created_at");
      CREATE INDEX IF NOT EXISTS "university_templates_status_idx" ON "university_templates" ("status");
    `);
  }

  // Check if payload_locked_documents__rels table exists
  const lockedDocsRelsExists = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'payload_locked_documents__rels'
    );
  `);

  if (lockedDocsRelsExists[0]?.exists) {
    // Check if university_templates_id column exists
    const universityTemplatesIdExists = await payload.db.drizzle.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'payload_locked_documents__rels' 
        AND column_name = 'university_templates_id'
      );
    `);

    // Add university_templates_id column if it doesn't exist
    if (!universityTemplatesIdExists[0]?.exists) {
      await payload.db.drizzle.execute(sql`
        ALTER TABLE "payload_locked_documents__rels" 
        ADD COLUMN "university_templates_id" integer;
      `);

      // Add foreign key constraint
      await payload.db.drizzle.execute(sql`
        DO $$ BEGIN
          ALTER TABLE "payload_locked_documents__rels" 
          ADD CONSTRAINT "payload_locked_documents__rels_university_templates_fk" 
          FOREIGN KEY ("university_templates_id") REFERENCES "university_templates"("id") ON DELETE CASCADE;
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
    }

    // Check if universities_id column exists
    const universitiesIdExists = await payload.db.drizzle.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'payload_locked_documents__rels' 
        AND column_name = 'universities_id'
      );
    `);

    // Add universities_id column if it doesn't exist
    if (!universitiesIdExists[0]?.exists) {
      await payload.db.drizzle.execute(sql`
        ALTER TABLE "payload_locked_documents__rels" 
        ADD COLUMN "universities_id" integer;
      `);

      // Add foreign key constraint
      await payload.db.drizzle.execute(sql`
        DO $$ BEGIN
          ALTER TABLE "payload_locked_documents__rels" 
          ADD CONSTRAINT "payload_locked_documents__rels_universities_fk" 
          FOREIGN KEY ("universities_id") REFERENCES "universities"("id") ON DELETE CASCADE;
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
    }
  }

  // Check if universities table exists and phone column exists
  const universitiesExists = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'universities'
    );
  `);

  if (universitiesExists[0]?.exists) {
    const phoneColumnExists = await payload.db.drizzle.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'universities' 
        AND column_name = 'phone'
      );
    `);

    // Only add phone column if it doesn't exist
    if (!phoneColumnExists[0]?.exists) {
      await payload.db.drizzle.execute(sql`
        ALTER TABLE "universities" 
        ADD COLUMN "phone" varchar;
      `);
    }
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Remove the added columns
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "payload_locked_documents__rels" 
    DROP COLUMN IF EXISTS "university_templates_id";
  `);

  await payload.db.drizzle.execute(sql`
    ALTER TABLE "payload_locked_documents__rels" 
    DROP COLUMN IF EXISTS "universities_id";
  `);

  await payload.db.drizzle.execute(sql`
    ALTER TABLE "universities" 
    DROP COLUMN IF EXISTS "phone";
  `);

  // Drop university_templates table
  await payload.db.drizzle.execute(sql`
    DROP TABLE IF EXISTS "university_templates";
  `);
}