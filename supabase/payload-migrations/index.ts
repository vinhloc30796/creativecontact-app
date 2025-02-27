import * as migration_20250227_141625_init_staffs from './20250227_141625_init_staffs';
import * as migration_20250227_142445_init_posts_events from './20250227_142445_init_posts_events';

export const migrations = [
  {
    up: migration_20250227_141625_init_staffs.up,
    down: migration_20250227_141625_init_staffs.down,
    name: '20250227_141625_init_staffs',
  },
  {
    up: migration_20250227_142445_init_posts_events.up,
    down: migration_20250227_142445_init_posts_events.down,
    name: '20250227_142445_init_posts_events'
  },
];
