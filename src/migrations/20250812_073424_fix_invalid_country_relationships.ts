import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // First, check if countries and universities tables exist
  const countriesExists = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'countries'
    );
  `);

  const universitiesExists = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'universities'
    );
  `);

  if (!countriesExists[0]?.exists || !universitiesExists[0]?.exists) {
    console.log('Countries or Universities table does not exist, skipping migration');
    return;
  }

  // Check if universities__rels table exists (for relationships)
  const universitiesRelsExists = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'universities__rels'
    );
  `);

  if (universitiesRelsExists[0]?.exists) {
    // Fix invalid country relationships in universities__rels table
    console.log('Fixing invalid country relationships in universities__rels table...');
    
    // Delete any relationships where the country_id doesn't exist in countries table
    await payload.db.drizzle.execute(sql`
      DELETE FROM universities__rels 
      WHERE path = 'country' 
      AND countries_id IS NOT NULL 
      AND countries_id NOT IN (SELECT id FROM countries);
    `);

    // Delete any relationships with obviously invalid IDs (0, negative numbers, etc.)
    await payload.db.drizzle.execute(sql`
      DELETE FROM universities__rels 
      WHERE path = 'country' 
      AND (countries_id <= 0 OR countries_id IS NULL);
    `);
  }

  // Check if there's a direct country column in universities table
  const countryColumnExists = await payload.db.drizzle.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'universities' 
      AND column_name = 'country'
    );
  `);

  if (countryColumnExists[0]?.exists) {
    console.log('Fixing invalid country references in universities.country column...');
    
    // Set country to NULL for universities with invalid country references
    await payload.db.drizzle.execute(sql`
      UPDATE universities 
      SET country = NULL 
      WHERE country IS NOT NULL 
      AND country NOT IN (SELECT id FROM countries);
    `);

    // Handle string values like "2 0" that might be stored incorrectly
    await payload.db.drizzle.execute(sql`
      UPDATE universities 
      SET country = NULL 
      WHERE country::text ~ '^[0-9]+\s+[0-9]+$';
    `);
  }

  console.log('Invalid country relationships have been cleaned up');
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // This migration only cleans up invalid data, so there's no meaningful rollback
  console.log('This migration only cleaned up invalid data, no rollback needed');
}