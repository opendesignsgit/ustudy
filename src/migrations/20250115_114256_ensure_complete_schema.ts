import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Ensure all required columns exist in universities table
  await payload.db.drizzle.execute(sql`
    -- Add email column if missing
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "email" varchar;
    
    -- Add missing auth columns for universities if not exist
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "password" varchar;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "salt" varchar;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "hash" varchar;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "login_attempts" integer DEFAULT 0;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "lock_until" timestamp(3) with time zone;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "reset_password_token" varchar;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "reset_password_expiration" timestamp(3) with time zone;
    
    -- Add missing relationship columns
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "logo_id" integer;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "secondary_logo_id" integer;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "university_image_id" integer;
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "country_id" integer;
    
    -- Add updated_at and created_at if missing
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now();
    ALTER TABLE "universities" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now();
  `);

  // Ensure students table has all required columns
  await payload.db.drizzle.execute(sql`
    -- Add auth columns for students if not exist
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "password" varchar;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "salt" varchar;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "hash" varchar;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "login_attempts" integer DEFAULT 0;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "lock_until" timestamp(3) with time zone;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "reset_password_token" varchar;
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "reset_password_expiration" timestamp(3) with time zone;
    
    -- Add missing relationship columns
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "profile_pic_id" integer;
    
    -- Add updated_at and created_at if missing
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "updated_at" timestamp(3) with time zone DEFAULT now();
    ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "created_at" timestamp(3) with time zone DEFAULT now();
  `);

  // Add foreign key constraints that might be missing
  await payload.db.drizzle.execute(sql`
    -- Universities foreign keys
    DO $$ BEGIN
      ALTER TABLE "universities" ADD CONSTRAINT "universities_logo_id_media_id_fk" 
      FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "universities" ADD CONSTRAINT "universities_secondary_logo_id_media_id_fk" 
      FOREIGN KEY ("secondary_logo_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "universities" ADD CONSTRAINT "universities_university_image_id_media_id_fk" 
      FOREIGN KEY ("university_image_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "universities" ADD CONSTRAINT "universities_country_id_countries_id_fk" 
      FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- Students foreign keys
    DO $$ BEGIN
      ALTER TABLE "students" ADD CONSTRAINT "students_profile_pic_id_media_id_fk" 
      FOREIGN KEY ("profile_pic_id") REFERENCES "media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Ensure university_templates table exists and has all columns
  await payload.db.drizzle.execute(sql`
    CREATE TABLE IF NOT EXISTS "university_templates" (
      "id" serial PRIMARY KEY,
      "title" varchar NOT NULL,
      "description" text,
      "status" varchar NOT NULL DEFAULT 'draft',
      "preview_image_id" integer,
      "content" jsonb NOT NULL,
      "category" varchar NOT NULL DEFAULT 'landing',
      "slug" varchar,
      "slug_lock" boolean DEFAULT false,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);

  // Add indexes for better performance
  await payload.db.drizzle.execute(sql`
    CREATE INDEX IF NOT EXISTS "universities_email_idx" ON "universities" ("email");
    CREATE INDEX IF NOT EXISTS "universities_phone_idx" ON "universities" ("phone");
    CREATE INDEX IF NOT EXISTS "universities_country_id_idx" ON "universities" ("country_id");
    CREATE INDEX IF NOT EXISTS "universities_template_id_idx" ON "universities" ("template_id");
    CREATE INDEX IF NOT EXISTS "universities_created_at_idx" ON "universities" ("created_at");
    
    CREATE INDEX IF NOT EXISTS "students_email_idx" ON "students" ("email");
    CREATE INDEX IF NOT EXISTS "students_phone_idx" ON "students" ("phone");
    CREATE INDEX IF NOT EXISTS "students_created_at_idx" ON "students" ("created_at");
    
    CREATE INDEX IF NOT EXISTS "university_templates_status_idx" ON "university_templates" ("status");
    CREATE INDEX IF NOT EXISTS "university_templates_category_idx" ON "university_templates" ("category");
    CREATE INDEX IF NOT EXISTS "university_templates_slug_idx" ON "university_templates" ("slug");
    CREATE INDEX IF NOT EXISTS "university_templates_created_at_idx" ON "university_templates" ("created_at");
  `);

  // Ensure unique constraints exist
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "universities" ADD CONSTRAINT "universities_email_unique" UNIQUE ("email");
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "universities" ADD CONSTRAINT "universities_phone_unique" UNIQUE ("phone");
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "students" ADD CONSTRAINT "students_email_unique" UNIQUE ("email");
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "students" ADD CONSTRAINT "students_phone_unique" UNIQUE ("phone");
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Create missing relationship tables that PayloadCMS might need
  await payload.db.drizzle.execute(sql`
    -- Create students interested courses relationship table
    CREATE TABLE IF NOT EXISTS "students_interested_courses" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "course_id" integer,
      "date_added" timestamp(3) with time zone DEFAULT now()
    );

    -- Create students browsed courses relationship table  
    CREATE TABLE IF NOT EXISTS "students_browsed_courses" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "course_id" integer,
      "date_browsed" timestamp(3) with time zone DEFAULT now()
    );
  `);

  // Add foreign keys for student relationship tables
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "students_interested_courses" ADD CONSTRAINT "students_interested_courses_parent_id_students_id_fk" 
      FOREIGN KEY ("_parent_id") REFERENCES "students"("id") ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "students_interested_courses" ADD CONSTRAINT "students_interested_courses_course_id_courses_id_fk" 
      FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "students_browsed_courses" ADD CONSTRAINT "students_browsed_courses_parent_id_students_id_fk" 
      FOREIGN KEY ("_parent_id") REFERENCES "students"("id") ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "students_browsed_courses" ADD CONSTRAINT "students_browsed_courses_course_id_courses_id_fk" 
      FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Add indexes for relationship tables
  await payload.db.drizzle.execute(sql`
    CREATE INDEX IF NOT EXISTS "students_interested_courses_parent_id_idx" ON "students_interested_courses" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "students_interested_courses_course_id_idx" ON "students_interested_courses" ("course_id");
    CREATE INDEX IF NOT EXISTS "students_interested_courses_order_idx" ON "students_interested_courses" ("_order");
    
    CREATE INDEX IF NOT EXISTS "students_browsed_courses_parent_id_idx" ON "students_browsed_courses" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "students_browsed_courses_course_id_idx" ON "students_browsed_courses" ("course_id");
    CREATE INDEX IF NOT EXISTS "students_browsed_courses_order_idx" ON "students_browsed_courses" ("_order");
  `);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Drop relationship tables
  await payload.db.drizzle.execute(sql`
    DROP TABLE IF EXISTS "students_interested_courses";
    DROP TABLE IF EXISTS "students_browsed_courses";
  `);

  // Note: We don't drop columns in down migration to avoid data loss
  // This is a safety measure for production environments
}