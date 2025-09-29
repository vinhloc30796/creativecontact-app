ALTER TABLE "portfolio_artworks" DROP CONSTRAINT "portfolio_artworks_event_id_events_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "idx_portfolio_artworks_event_id";--> statement-breakpoint
ALTER TABLE "portfolio_artworks" DROP COLUMN IF EXISTS "event_id";