import { pgTable, uuid, timestamp, integer, text } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  createdBy: uuid('created_by').notNull()
});

export const eventSlots = pgTable('event_slots', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at').notNull(),
  event: uuid('event').references(() => events.id).notNull(),
  timeStart: timestamp('time_start').notNull(),
  timeEnd: timestamp('time_end').notNull(),
  capacity: integer('capacity').notNull()
});