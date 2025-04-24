import * as migration_20250227_141625_init_staffs from './20250227_141625_init_staffs';
import * as migration_20250227_142445_init_posts_events from './20250227_142445_init_posts_events';
import * as migration_20250424_141059_init_event_blocks from './20250424_141059_init_event_blocks';

export const migrations = [
  {
    up: migration_20250227_141625_init_staffs.up,
    down: migration_20250227_141625_init_staffs.down,
    name: '20250227_141625_init_staffs',
  },
  {
    up: migration_20250227_142445_init_posts_events.up,
    down: migration_20250227_142445_init_posts_events.down,
    name: '20250227_142445_init_posts_events',
  },
  {
    up: migration_20250424_141059_init_event_blocks.up,
    down: migration_20250424_141059_init_event_blocks.down,
    name: '20250424_141059_init_event_blocks'
  },
];
