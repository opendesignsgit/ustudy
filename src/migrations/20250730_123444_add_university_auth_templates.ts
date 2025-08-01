import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create university-templates table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "university_templates" (
      "id" serial PRIMARY KEY,
      "title" varchar NOT NULL,
      "description" text,
      "status" varchar NOT NULL DEFAULT 'draft',
      "preview_image_id" integer,
      "content" jsonb,
      "category" varchar NOT NULL DEFAULT 'landing',
      "slug" varchar,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);

  // Add indexes for university-templates
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "university_templates_status_idx" ON "university_templates" USING btree ("status");
    CREATE INDEX IF NOT EXISTS "university_templates_category_idx" ON "university_templates" USING btree ("category");
    CREATE INDEX IF NOT EXISTS "university_templates_slug_idx" ON "university_templates" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "university_templates_created_at_idx" ON "university_templates" USING btree ("created_at");
  `);

  // Add foreign key for preview_image_id
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "university_templates" ADD CONSTRAINT "university_templates_preview_image_id_media_id_fk" 
      FOREIGN KEY ("preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Modify universities table to add authentication and new fields
  await db.execute(sql`
    -- Add phone field (unique)
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "phone" varchar;
    
    -- Add password field for authentication
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "password" varchar;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "salt" varchar;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "hash" varchar;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "login_attempts" integer DEFAULT 0;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "lock_until" timestamp(3) with time zone;
    
    -- Add new fields
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "template_id" integer;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "website_url" varchar;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "description" text;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "content" jsonb;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
    
    -- Add updated_at if not exists
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now();
  `);

  // Add unique constraints
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "universities" ADD CONSTRAINT "universities_phone_unique" UNIQUE ("phone");
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    DO $$ BEGIN
      ALTER TABLE "universities" ADD CONSTRAINT "universities_email_unique" UNIQUE ("email");
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Add foreign key for template relationship
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "universities" ADD CONSTRAINT "universities_template_id_university_templates_id_fk" 
      FOREIGN KEY ("template_id") REFERENCES "public"."university_templates"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Add indexes for universities
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "universities_phone_idx" ON "universities" USING btree ("phone");
    CREATE UNIQUE INDEX IF NOT EXISTS "universities_email_idx" ON "universities" USING btree ("email");
    CREATE INDEX IF NOT EXISTS "universities_template_id_idx" ON "universities" USING btree ("template_id");
    CREATE INDEX IF NOT EXISTS "universities_is_active_idx" ON "universities" USING btree ("is_active");
  `);

  // Create university-templates versions table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_university_templates_v" (
      "id" serial PRIMARY KEY,
      "parent_id" integer,
      "version_title" varchar,
      "version_description" text,
      "version_status" varchar DEFAULT 'draft',
      "version_preview_image_id" integer,
      "version_content" jsonb,
      "version_category" varchar DEFAULT 'landing',
      "version_slug" varchar,
      "version_created_at" timestamp(3) with time zone DEFAULT now(),
      "version_updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
  `);

  // Add foreign keys for versions table
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_university_templates_v" ADD CONSTRAINT "_university_templates_v_parent_id_university_templates_id_fk" 
      FOREIGN KEY ("parent_id") REFERENCES "public"."university_templates"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_university_templates_v" ADD CONSTRAINT "_university_templates_v_version_preview_image_id_media_id_fk" 
      FOREIGN KEY ("version_preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Create universities versions table for new fields
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_universities_v" (
      "id" serial PRIMARY KEY,
      "parent_id" integer,
      "version_title" varchar,
      "version_phone" varchar,
      "version_email" varchar,
      "version_logo_id" integer,
      "version_secondary_logo_id" integer,
      "version_university_image_id" integer,
      "version_country_id" integer,
      "version_template_id" integer,
      "version_website_url" varchar,
      "version_description" text,
      "version_content" jsonb,
      "version_is_active" boolean DEFAULT true,
      "version_slug" varchar,
      "version_created_at" timestamp(3) with time zone DEFAULT now(),
      "version_updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
  `);

  // Add foreign keys for universities versions table
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_universities_v" ADD CONSTRAINT "_universities_v_parent_id_universities_id_fk" 
      FOREIGN KEY ("parent_id") REFERENCES "public"."universities"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_universities_v" ADD CONSTRAINT "_universities_v_version_logo_id_media_id_fk" 
      FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_universities_v" ADD CONSTRAINT "_universities_v_version_secondary_logo_id_media_id_fk" 
      FOREIGN KEY ("version_secondary_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_universities_v" ADD CONSTRAINT "_universities_v_version_university_image_id_media_id_fk" 
      FOREIGN KEY ("version_university_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_universities_v" ADD CONSTRAINT "_universities_v_version_country_id_countries_id_fk" 
      FOREIGN KEY ("version_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_universities_v" ADD CONSTRAINT "_universities_v_version_template_id_university_templates_id_fk" 
      FOREIGN KEY ("version_template_id") REFERENCES "public"."university_templates"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Drop versions tables
  await db.execute(sql`DROP TABLE IF EXISTS "_university_templates_v";`);
  await db.execute(sql`DROP TABLE IF EXISTS "_universities_v";`);

  // Remove foreign keys and new columns from universities
  await db.execute(sql`
    ALTER TABLE "universities" DROP CONSTRAINT IF EXISTS "universities_template_id_university_templates_id_fk";
    ALTER TABLE "universities" DROP CONSTRAINT IF EXISTS "universities_phone_unique";
    ALTER TABLE "universities" DROP CONSTRAINT IF EXISTS "universities_email_unique";
    
    DROP INDEX IF EXISTS "universities_phone_idx";
    DROP INDEX IF EXISTS "universities_email_idx";
    DROP INDEX IF EXISTS "universities_template_id_idx";
    DROP INDEX IF EXISTS "universities_is_active_idx";
    
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "phone";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "password";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "salt";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "hash";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "login_attempts";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "lock_until";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "template_id";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "website_url";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "content";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "is_active";
    ALTER TABLE "universities" DROP COLUMN IF EXISTS "updated_at";
  `);

  // Drop university-templates table
  await db.execute(sql`
    DROP INDEX IF EXISTS "university_templates_status_idx";
    DROP INDEX IF EXISTS "university_templates_category_idx";
    DROP INDEX IF EXISTS "university_templates_slug_idx";
    DROP INDEX IF EXISTS "university_templates_created_at_idx";
    
    ALTER TABLE "university_templates" DROP CONSTRAINT IF EXISTS "university_templates_preview_image_id_media_id_fk";
    
    DROP TABLE IF EXISTS "university_templates";
  `);
}