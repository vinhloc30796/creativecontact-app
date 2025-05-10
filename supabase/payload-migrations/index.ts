import * as migration_20250227_141625_init_staffs from './20250227_141625_init_staffs';
import * as migration_20250227_142445_init_posts_events from './20250227_142445_init_posts_events';
import * as migration_20250424_141059_init_event_blocks from './20250424_141059_init_event_blocks';
import * as migration_20250424_150118_add_staff_verification_fields from './20250424_150118_add_staff_verification_fields';
import * as migration_20250508_084716_add_staff_approval_status from './20250508_084716_add_staff_approval_status';
import * as migration_20250510_140253_add_api_key_for_staff from './20250510_140253_add_api_key_for_staff';

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
    name: '20250424_141059_init_event_blocks',
  },
  {
    up: migration_20250424_150118_add_staff_verification_fields.up,
    down: migration_20250424_150118_add_staff_verification_fields.down,
    name: '20250424_150118_add_staff_verification_fields',
  },
  {
    up: migration_20250508_084716_add_staff_approval_status.up,
    down: migration_20250508_084716_add_staff_approval_status.down,
    name: '20250508_084716_add_staff_approval_status',
  },
  {
    up: migration_20250510_140253_add_api_key_for_staff.up,
    down: migration_20250510_140253_add_api_key_for_staff.down,
    name: '20250510_140253_add_api_key_for_staff'
  },
];
