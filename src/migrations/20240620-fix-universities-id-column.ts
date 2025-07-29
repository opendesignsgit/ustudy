// src/migrations/20240620-fix-universities-id-column.ts
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      -- Check if the wrong column name exists
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'universities' AND column_name = 'universities_id'
      ) THEN
        -- Rename to the correct column name
        ALTER TABLE "universities" RENAME COLUMN "universities_id" TO "id";
        RAISE NOTICE 'Renamed universities_id to id';
      END IF;
    END $$;
  `);

  // Fix relationship tables if they exist
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'universities_rels'
      ) THEN
        -- Update column references in relationship tables
        ALTER TABLE "universities_rels" 
          RENAME COLUMN "universities_id" TO "parent_id";
        
        RAISE NOTICE 'Updated relationship table columns';
      END IF;
    END $$;
  `);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Optional down migration if needed
  await payload.db.drizzle.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'universities' AND column_name = 'id'
      ) THEN
        ALTER TABLE "universities" RENAME COLUMN "id" TO "universities_id";
      END IF;
    END $$;
  `);
}