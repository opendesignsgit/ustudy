import * as migration_20250605_100523 from './20250605_100523';
import * as migration_20250605_103447 from './20250605_103447';
import * as migration_20250605_104043 from './20250605_104043';

export const migrations = [
  {
    up: migration_20250605_100523.up,
    down: migration_20250605_100523.down,
    name: '20250605_100523',
  },
  {
    up: migration_20250605_103447.up,
    down: migration_20250605_103447.down,
    name: '20250605_103447',
  },
  {
    up: migration_20250605_104043.up,
    down: migration_20250605_104043.down,
    name: '20250605_104043'
  },
];
