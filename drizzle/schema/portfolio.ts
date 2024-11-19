import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { Artwork, artworks } from "./artwork";
import { authUsers } from "./user";

export const portfolioArtworks = pgTable("portfolio_artworks", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  artworkId: uuid("artwork_id")
    .notNull()
    .references(() => artworks.id, { onDelete: "cascade" }),
  displayOrder: integer("display_order").notNull().default(0),
  isHighlighted: boolean("is_highlighted").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PortfolioArtwork = typeof portfolioArtworks.$inferSelect;
export type PortfolioArtworkWithDetails = {
  portfolioArtworks: PortfolioArtwork;
  artworks: Artwork | null;
};
