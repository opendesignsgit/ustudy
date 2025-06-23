import * as migration_20250611_112303_study_year_has_many from './20250611_112303_study_year_has_many';

export const migrations = [
  {
    up: migration_20250611_112303_study_year_has_many.up,
    down: migration_20250611_112303_study_year_has_many.down,
    name: '20250611_112303_study_year_has_many'
  },
];
