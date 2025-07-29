import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // 1. Create table if it doesn't exist
  await payload.db.drizzle.execute(sql`
    CREATE TABLE IF NOT EXISTS "universities" (
      "id" text PRIMARY KEY,
      "title" text NOT NULL,
      "email" text NOT NULL,
      "phone" text NOT NULL,
      "country" integer,  -- Changed to match countries.id type
      "template" text,
      "slug" text,
      "password" text,
      "reset_password_token" text,
      "reset_password_expiration" timestamp,
      "_verified" boolean,
      "_verification_token" text,
      "created_at" timestamp DEFAULT now(),
      "updated_at" timestamp DEFAULT now(),
      "logo" text,
      "secondary_logo" text,
      "university_image" text,
      "content" jsonb
    )
  `);

  // 2. Convert existing country data if needed
  await payload.db.drizzle.execute(sql`
    DO $$ 
    DECLARE
      col_exists boolean;
      has_data boolean;
    BEGIN
      -- Check if country column exists and has text data
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'universities' AND column_name = 'country' AND data_type = 'text'
      ) INTO col_exists;
      
      -- Check if table has any data
      SELECT EXISTS (SELECT 1 FROM "universities" LIMIT 1) INTO has_data;
      
      -- Only attempt conversion if needed
      IF col_exists AND has_data THEN
        -- Add temporary column for conversion
        ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "country_new" integer;
        
        -- Convert text country values to integers
        UPDATE "universities" 
        SET "country_new" = CAST("country" AS integer)
        WHERE "country" ~ '^\d+$';
        
        -- Drop old column and rename new one
        ALTER TABLE "universities" DROP COLUMN "country";
        ALTER TABLE "universities" RENAME COLUMN "country_new" TO "country";
        
        RAISE NOTICE 'Converted country column from text to integer';
      END IF;
    END $$;
  `);

  // 3. Add constraints
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'universities_country_fk'
      ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'countries'
      ) THEN
        ALTER TABLE "universities" ADD CONSTRAINT "universities_country_fk"
          FOREIGN KEY ("country") REFERENCES "countries"("id") ON DELETE SET NULL;
      END IF;
    END $$;
  `);

  // 4. Add constraints only after ensuring columns exist
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'universities_email_unique'
      ) THEN
        ALTER TABLE "universities" ADD CONSTRAINT "universities_email_unique" UNIQUE ("email");
      END IF;
    END $$;
  `);

  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'universities_phone_unique'
      ) THEN
        ALTER TABLE "universities" ADD CONSTRAINT "universities_phone_unique" UNIQUE ("phone");
      END IF;
    END $$;
  `);

  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'universities_slug_unique'
      ) THEN
        ALTER TABLE "universities" ADD CONSTRAINT "universities_slug_unique" UNIQUE ("slug");
      END IF;
    END $$;
  `);

  // 5. Add foreign key constraints with proper checks
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      -- Only add FK if countries table exists
      IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'countries'
      ) THEN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'universities_country_fk'
        ) THEN
          ALTER TABLE "universities" ADD CONSTRAINT "universities_country_fk"
            FOREIGN KEY ("country") REFERENCES "countries"("id") ON DELETE SET NULL;
        END IF;
      ELSE
        RAISE NOTICE 'Skipping countries FK - countries table does not exist';
      END IF;
    END $$;
  `);

  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      -- Only add FK if university-templates table exists
      IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'university-templates'
      ) THEN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'universities_template_fk'
        ) THEN
          ALTER TABLE "universities" ADD CONSTRAINT "universities_template_fk"
            FOREIGN KEY ("template") REFERENCES "university-templates"("id") ON DELETE SET NULL;
        END IF;
      ELSE
        RAISE NOTICE 'Skipping templates FK - university-templates table does not exist';
      END IF;
    END $$;
  `);

  // 6. Create indexes
  await payload.db.drizzle.execute(sql`
    CREATE INDEX IF NOT EXISTS "universities_email_idx" ON "universities" ("email");
  `);

  await payload.db.drizzle.execute(sql`
    CREATE INDEX IF NOT EXISTS "universities_phone_idx" ON "universities" ("phone");
  `);

  await payload.db.drizzle.execute(sql`
    CREATE INDEX IF NOT EXISTS "universities_slug_idx" ON "universities" ("slug");
  `);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // 1. Drop constraints if they exist
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'universities_country_fk'
      ) THEN
        ALTER TABLE "universities" DROP CONSTRAINT "universities_country_fk";
      END IF;
    END $$;
  `);

  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'universities_template_fk'
      ) THEN
        ALTER TABLE "universities" DROP CONSTRAINT "universities_template_fk";
      END IF;
    END $$;
  `);

  // 2. Drop indexes
  await payload.db.drizzle.execute(sql`
    DROP INDEX IF EXISTS "universities_email_idx";
  `);

  await payload.db.drizzle.execute(sql`
    DROP INDEX IF EXISTS "universities_phone_idx";
  `);

  await payload.db.drizzle.execute(sql`
    DROP INDEX IF EXISTS "universities_slug_idx";
  `);

  // 3. For safety, we won't drop the table in down migration
  // Just remove the phone column if it exists
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "phone";
  `);
}