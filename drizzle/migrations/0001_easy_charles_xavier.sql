CREATE TABLE IF NOT EXISTS "portfolio_artwork_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_artwork_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_portfolio_artwork_event" UNIQUE("portfolio_artwork_id","event_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolio_artwork_events" ADD CONSTRAINT "portfolio_artwork_events_portfolio_artwork_id_portfolio_artworks_id_fk" FOREIGN KEY ("portfolio_artwork_id") REFERENCES "public"."portfolio_artworks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolio_artwork_events" ADD CONSTRAINT "portfolio_artwork_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_portfolio_artwork_events_portfolio_artwork_id" ON "portfolio_artwork_events" USING btree ("portfolio_artwork_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_portfolio_artwork_events_event_id" ON "portfolio_artwork_events" USING btree ("event_id");