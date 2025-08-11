import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Check if payload_locked_documents table exists first
  const lockedDocsExists = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'payload_locked_documents'
    );
  `);

  // Check if payload_locked_documents__rels table exists
  const lockedDocsRelsExists = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'payload_locked_documents__rels'
    );
  `);

  // Create payload_locked_documents table if it doesn't exist
  if (!lockedDocsExists[0]?.exists) {
    await payload.db.drizzle.execute(sql`
      CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
        "id" serial PRIMARY KEY NOT NULL,
        "global_slug" varchar,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );
    `);

    await payload.db.drizzle.execute(sql`
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" ("global_slug");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" ("updated_at");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" ("created_at");
    `);
  }

  // Create payload_locked_documents__rels table if it doesn't exist
  if (!lockedDocsRelsExists[0]?.exists) {
    await payload.db.drizzle.execute(sql`
      CREATE TABLE IF NOT EXISTS "payload_locked_documents__rels" (
        "id" serial PRIMARY KEY NOT NULL,
        "order" integer,
        "parent_id" integer NOT NULL,
        "path" varchar NOT NULL,
        "universities_id" integer,
        "users_id" integer,
        "courses_id" integer,
        "university_templates_id" integer
      );
    `);

    await payload.db.drizzle.execute(sql`
      CREATE INDEX IF NOT EXISTS "payload_locked_documents__rels_order_idx" ON "payload_locked_documents__rels" ("order");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents__rels_parent_idx" ON "payload_locked_documents__rels" ("parent_id");
      CREATE INDEX IF NOT EXISTS "payload_locked_documents__rels_path_idx" ON "payload_locked_documents__rels" ("path");
    `);

    // Add foreign key constraints
    await payload.db.drizzle.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "payload_locked_documents__rels" ADD CONSTRAINT "payload_locked_documents__rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_locked_documents"("id") ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await payload.db.drizzle.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "payload_locked_documents__rels" ADD CONSTRAINT "payload_locked_documents__rels_universities_fk" FOREIGN KEY ("universities_id") REFERENCES "universities"("id") ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await payload.db.drizzle.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "payload_locked_documents__rels" ADD CONSTRAINT "payload_locked_documents__rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await payload.db.drizzle.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "payload_locked_documents__rels" ADD CONSTRAINT "payload_locked_documents__rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "courses"("id") ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await payload.db.drizzle.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "payload_locked_documents__rels" ADD CONSTRAINT "payload_locked_documents__rels_university_templates_fk" FOREIGN KEY ("university_templates_id") REFERENCES "university_templates"("id") ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  } else {
    // If table exists, just add the missing university_templates_id column
    await payload.db.drizzle.execute(sql`
      ALTER TABLE "payload_locked_documents__rels" 
      ADD COLUMN IF NOT EXISTS "university_templates_id" integer;
    `);

    await payload.db.drizzle.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "payload_locked_documents__rels" ADD CONSTRAINT "payload_locked_documents__rels_university_templates_fk" FOREIGN KEY ("university_templates_id") REFERENCES "university_templates"("id") ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "payload_locked_documents__rels" 
    DROP COLUMN IF EXISTS "university_templates_id";
  `);
}