import * as migration_20250730_123444_add_university_auth_templates from './20250730_123444_add_university_auth_templates';
import * as migration_20250801_051900_check_and_fix_university_templates_rels from './20250801_051900_check_and_fix_university_templates_rels';
import * as migration_20250812_073424_fix_invalid_country_relationships from './20250812_073424_fix_invalid_country_relationships';

export const migrations = [
  {
    up: migration_20250730_123444_add_university_auth_templates.up,
    down: migration_20250730_123444_add_university_auth_templates.down,
    name: '20250730_123444_add_university_auth_templates'
  },
  {
    up: migration_20250801_051900_check_and_fix_university_templates_rels.up,
    down: migration_20250801_051900_check_and_fix_university_templates_rels.down,
    name: '20250801_051900_check_and_fix_university_templates_rels'
  },
  {
    up: migration_20250812_073424_fix_invalid_country_relationships.up,
    down: migration_20250812_073424_fix_invalid_country_relationships.down,
    name: '20250812_073424_fix_invalid_country_relationships'
  },
];
