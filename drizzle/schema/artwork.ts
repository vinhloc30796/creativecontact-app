// File: drizzle/schema/artwork.ts

import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { authUsers } from "./user";
import { events } from "./event";

/* postgres=> \d artworks
                              Table "public.artworks"
   Column    |           Type           | Collation | Nullable |      Default      
-------------+--------------------------+-----------+----------+-------------------
 id          | uuid                     |           | not null | gen_random_uuid()
 created_at  | timestamp with time zone |           | not null | now()
 title       | text                     |           | not null | 
 description | text                     |           |          | 
 max_assets  | integer                  |           | not null | 5
Indexes:
    "artworks_pkey" PRIMARY KEY, btree (id)
    "idx_artworks_fts" gin (to_tsvector('english'::regconfig, (title || ' '::text) || COALESCE(description, ''::text)))
    "idx_artworks_title" btree (title)
Referenced by:
    TABLE "artwork_assets" CONSTRAINT "artwork_assets_artwork_id_fkey" FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
    TABLE "artwork_credits" CONSTRAINT "artwork_credits_artwork_id_fkey" FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
    TABLE "artwork_events" CONSTRAINT "artwork_events_artwork_id_fkey" FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
*/

export const artworks = pgTable("artworks", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  title: text("title").notNull(),
  description: text("description"),
});

export type Artwork = InferSelectModel<typeof artworks>;
export type NewArtwork = InferInsertModel<typeof artworks>;

/* postgres=> \d artwork_credits
                Table "public.artwork_credits"
   Column   | Type | Collation | Nullable |      Default      
------------+------+-----------+----------+-------------------
 id         | uuid |           | not null | gen_random_uuid()
 artwork_id | uuid |           | not null | 
 user_id    | uuid |           | not null | 
 title      | text |           |          | 
Indexes:
    "artwork_credits_pkey" PRIMARY KEY, btree (id)
    "artwork_credits_artwork_id_user_id_key" UNIQUE CONSTRAINT, btree (artwork_id, user_id)
    "idx_artwork_credits_artwork_id" btree (artwork_id)
    "idx_artwork_credits_user_id" btree (user_id)
Foreign-key constraints:
    "artwork_credits_artwork_id_fkey" FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
    "artwork_credits_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
*/

export const artworkCredits = pgTable(
  "artwork_credits",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    artworkId: uuid("artwork_id")
      .notNull()
      .references(() => artworks.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    title: text("title"),
  },
  (table) => ({
    uniqueArtworkUser: unique("unique_artwork_user").on(
      table.artworkId,
      table.userId,
    ),
  }),
);

export type ArtworkCredit = InferSelectModel<typeof artworkCredits>;

/* postgres=> \d artwork_events
                Table "public.artwork_events"
   Column   | Type | Collation | Nullable |      Default      
------------+------+-----------+----------+-------------------
 id         | uuid |           | not null | gen_random_uuid()
 artwork_id | uuid |           | not null | 
 event_id   | uuid |           | not null | 
Indexes:
    "artwork_events_pkey" PRIMARY KEY, btree (id)
    "artwork_events_artwork_id_event_id_key" UNIQUE CONSTRAINT, btree (artwork_id, event_id)
    "idx_artwork_events_artwork_id" btree (artwork_id)
    "idx_artwork_events_event_id" btree (event_id)
Foreign-key constraints:
    "artwork_events_artwork_id_fkey" FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
    "artwork_events_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
*/

export const artworkEvents = pgTable(
  "artwork_events",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    artworkId: uuid("artwork_id")
      .notNull()
      .references(() => artworks.id, { onDelete: "cascade" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueArtworkEvent: unique("unique_artwork_event").on(
      table.artworkId,
      table.eventId,
    ),
  }),
);

export type ArtworkEvent = InferSelectModel<typeof artworkEvents>;

/* postgres=> \dT+ asset_type
                                         List of data types
 Schema |    Name    | Internal name | Size | Elements |  Owner   | Access privileges | Description 
--------+------------+---------------+------+----------+----------+-------------------+-------------
 public | asset_type | asset_type    | 4    | image   +| postgres |                   | 
        |            |               |      | video   +|          |                   | 
        |            |               |      | audio   +|          |                   | 
        |            |               |      | font     |          |                   | 
(1 row)
*/

export const assetTypeEnum = pgEnum("asset_type", [
  "image",
  "video",
  "audio",
  "font",
]);

/* postgres=> \d artwork_assets
                             Table "public.artwork_assets"
   Column    |           Type           | Collation | Nullable |        Default         
-------------+--------------------------+-----------+----------+------------------------
 id          | uuid                     |           | not null | gen_random_uuid()
 artwork_id  | uuid                     |           | not null | 
 file_path   | text                     |           | not null | 
 description | text                     |           |          | 
 asset_type  | asset_type               |           | not null | 
 created_at  | timestamp with time zone |           | not null | now()
 bucket_id   | text                     |           | not null | 'artwork_assets'::text
Indexes:
    "artwork_assets_pkey" PRIMARY KEY, btree (id)
    "idx_artwork_assets_artwork_id" btree (artwork_id)
    "idx_artwork_assets_fts" gin (to_tsvector('english'::regconfig, (file_path || ' '::text) || COALESCE(description, ''::text)))
Foreign-key constraints:
    "artwork_assets_artwork_id_fkey" FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
    "fk_artwork_assets_bucket" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id)
*/

export const artworkAssets = pgTable("artwork_assets", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  artworkId: uuid("artwork_id")
    .notNull()
    .references(() => artworks.id, { onDelete: "cascade" }),
  filePath: text("file_path").notNull(),
  description: text("description"),
  assetType: assetTypeEnum("asset_type"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  bucketId: text("bucket_id").notNull().default("artwork_assets"),
  isThumbnail: boolean("is_thumbnail").notNull().default(false),
});

export type ArtworkAsset = InferSelectModel<typeof artworkAssets>;
