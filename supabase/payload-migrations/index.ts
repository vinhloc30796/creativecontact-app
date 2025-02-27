import * as migration_20250227_141625_init_staffs from './20250227_141625_init_staffs';

export const migrations = [
  {
    up: migration_20250227_141625_init_staffs.up,
    down: migration_20250227_141625_init_staffs.down,
    name: '20250227_141625_init_posts_staffs'
  },
];
