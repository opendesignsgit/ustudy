// src/migrations/20240620-migrate-universities-to-auth-and-content.ts
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    -- Step 1: Add auth columns
    ALTER TABLE "universities" 
      ADD COLUMN IF NOT EXISTS "password" text,
      ADD COLUMN IF NOT EXISTS "reset_password_token" text,
      ADD COLUMN IF NOT EXISTS "reset_password_expiration" timestamp,
      ADD COLUMN IF NOT EXISTS "_verified" boolean,
      ADD COLUMN IF NOT EXISTS "_verification_token" text,
      ADD COLUMN IF NOT EXISTS "login_attempts" integer,
      ADD COLUMN IF NOT EXISTS "lock_until" timestamp;

    -- Step 2: Add new fields
    ALTER TABLE "universities"
      ADD COLUMN IF NOT EXISTS "phone" text,
      ADD COLUMN IF NOT EXISTS "template" text,
      ADD COLUMN IF NOT EXISTS "content" jsonb;

    -- Step 3: Make email required and unique
    DO $$ 
    BEGIN
      -- First handle possible null emails
      UPDATE "universities" SET "email" = '' WHERE "email" IS NULL;
      
      -- Then alter the column
      ALTER TABLE "universities" 
        ALTER COLUMN "email" SET NOT NULL,
        ADD CONSTRAINT "universities_email_unique" UNIQUE ("email");
    EXCEPTION WHEN duplicate_object THEN
      RAISE NOTICE 'email unique constraint already exists';
    END $$;

    -- Step 4: Add phone unique constraint after ensuring no duplicates
    DO $$
    BEGIN
      -- Temporary disable constraint if duplicates exist
      IF EXISTS (
        SELECT 1 FROM "universities" 
        GROUP BY "phone" 
        HAVING COUNT(*) > 1 AND "phone" IS NOT NULL
      ) THEN
        -- Append ID to duplicate phones
        UPDATE "universities" u1
        SET "phone" = u1."phone" || '-' || u1.id
        FROM (
          SELECT id, phone FROM "universities"
          WHERE phone IN (
            SELECT phone FROM "universities" 
            GROUP BY phone 
            HAVING COUNT(*) > 1 AND phone IS NOT NULL
          )
        ) subq
        WHERE u1.id = subq.id;
      END IF;

      -- Add the constraint
      ALTER TABLE "universities" 
        ALTER COLUMN "phone" SET NOT NULL,
        ADD CONSTRAINT "universities_phone_unique" UNIQUE ("phone");
    EXCEPTION WHEN duplicate_object THEN
      RAISE NOTICE 'phone unique constraint already exists';
    END $$;

    -- Step 5: Set default empty content for existing records
    UPDATE "universities" SET "content" = '{}'::jsonb WHERE "content" IS NULL;

    -- Step 6: Ensure template relationship can be null temporarily
    ALTER TABLE "universities" ALTER COLUMN "template" DROP NOT NULL;
  `);

  // Step 7: Assign default template to existing universities
  // TODO: Fix collection slug reference
  // const defaultTemplate = await payload.find({
  //   collection: 'university-templates',
  //   limit: 1
  // });

  // if (defaultTemplate.docs.length > 0) {
  //   await payload.db.drizzle.execute(sql`
  //     UPDATE "universities" 
  //     SET "template" = ${defaultTemplate.docs[0].id}
  //     WHERE "template" IS NULL;
  //   `);
  // }

  // Step 8: Now make template required
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "universities" ALTER COLUMN "template" SET NOT NULL;
  `);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    -- Step 1: Remove auth columns
    ALTER TABLE "universities"
      DROP COLUMN IF EXISTS "password",
      DROP COLUMN IF EXISTS "reset_password_token",
      DROP COLUMN IF EXISTS "reset_password_expiration",
      DROP COLUMN IF EXISTS "_verified",
      DROP COLUMN IF EXISTS "_verification_token",
      DROP COLUMN IF EXISTS "login_attempts",
      DROP COLUMN IF EXISTS "lock_until";

    -- Step 2: Remove new fields (make optional first)
    ALTER TABLE "universities" 
      ALTER COLUMN "phone" DROP NOT NULL,
      ALTER COLUMN "template" DROP NOT NULL;
    
    -- Step 3: Remove constraints
    ALTER TABLE "universities"
      DROP CONSTRAINT IF EXISTS "universities_email_unique",
      DROP CONSTRAINT IF EXISTS "universities_phone_unique";

    -- Step 4: Revert email to nullable
    ALTER TABLE "universities" 
      ALTER COLUMN "email" DROP NOT NULL;
  `);
}