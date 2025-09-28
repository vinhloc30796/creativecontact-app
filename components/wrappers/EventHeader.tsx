// File: components/wrappers/EventHeader.tsx

import { Button } from "@/components/ui/button";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { use } from "react";
import CreativeContactLogo from "@/components/branding/CreativeContactLogo";
import BurgerMenu from "@/components/EventBurgerMenu";
import AboutEventDialog from "@/components/event/AboutEventDialog";
import { getEventAbout } from "@/lib/events/getEventAbout";

interface EventHeaderProps {
  eventSlug: string;
  lang: string;
  className?: string;
  stickyOverlay?: boolean;
  eventEnded?: boolean;
}

export async function EventHeader({
  eventSlug,
  lang,
  className,
  eventEnded = false,
  stickyOverlay = true,
}: EventHeaderProps) {
  const { t } = await getServerTranslation(lang, "EventPage");
  const headerLayoutClassName = stickyOverlay
    ? "fixed top-0 left-0 right-0 z-30"
    : "";

  const about = await getEventAbout(eventSlug, lang);

  return (
    <>
      <header
        className={cn("w-full", headerLayoutClassName, className)}
        style={{ ["--cc-header-h" as any]: "80px" }}
      >
        <div className="mx-auto flex w-full items-center justify-between px-4 py-4 md:px-16">
          <div className="flex-1">
            <Link href={`/event/${eventSlug}`}>
              <CreativeContactLogo className="h-8 w-auto fill-muted sm:h-12 md:h-16" />
            </Link>
          </div>
          <div className="hidden flex-1 justify-center lg:flex">
            {/* Desktop menu */}
            <div className="space-x-4">
              <Link
                href={`/event/${eventSlug}`}
                className="px-4 py-2 font-bold text-primary hover:bg-transparent hover:text-primary-500"
              >
                <span
                  style={{
                    textShadow: `hsl(var(--primary)) 0px 0px 10px`,
                  }}
                >
                  {t("gallery", { ns: "EventPage" })}
                </span>
              </Link>
              <AboutEventDialog
                trigger={
                  <button className="px-4 py-2 font-bold text-muted hover:bg-transparent hover:text-muted-foreground">
                    {t("about", { ns: "EventPage" })}
                  </button>
                }
                eventSlug={eventSlug}
                title={about.title}
                body={about.body}
                ctaText={about.ctaText}
              />
            </div>
          </div>
          <div className="hidden flex-1 justify-end lg:flex">
            {/* Desktop buttons */}
            <div className="flex flex-row space-x-4">
              <Button
                variant="outline"
                className={cn(
                  "relative inset-0 overflow-hidden rounded-full border-accent bg-accent/5 font-bold text-accent shadow-inner shadow-accent-500/50",
                  eventEnded
                    ? "cursor-not-allowed opacity-50 hover:shadow-none"
                    : "hover:shadow-md hover:shadow-accent-500/50"
                )}
                asChild
              >
                {eventEnded ? (
                  <span>{t("upload", { ns: "EventPage" })}</span>
                ) : (
                  <Link href={`/event/${eventSlug}/upload`}>
                    {t("upload", { ns: "EventPage" })}
                  </Link>
                )}
              </Button>
              <p>
                <Button
                  variant="ghost"
                  className="font-bold text-primary hover:bg-primary/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/signup">{t("signup", { ns: "EventPage" })}</Link>
                </Button>
                <span className="text-primary">|</span>
                <Button
                  variant="ghost"
                  className="font-bold text-primary hover:bg-primary/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/login">{t("login", { ns: "EventPage" })}</Link>
                </Button>
              </p>
            </div>
          </div>
          <div className="lg:hidden">
            <BurgerMenu lang={lang} eventSlug={eventSlug} />
          </div>
        </div>
      </header>
      {stickyOverlay && (
        <div aria-hidden className="w-full" style={{ height: "var(--cc-header-h, 80px)" }} />
      )}
    </>
  );
};
