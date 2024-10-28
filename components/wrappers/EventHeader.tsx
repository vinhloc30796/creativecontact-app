"use server";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/init-server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import CreativeContactLogo from "@/components/branding/CreativeContactLogo";
import BurgerMenu from "@/components/EventBurgerMenu";

interface EventHeaderProps {
  eventSlug: string;
  lang: string;
  className?: string;
  stickyOverlay?: boolean;
}

export const EventHeader: React.FC<EventHeaderProps> = async ({
  eventSlug,
  lang,
  className,
  stickyOverlay = true,
}) => {
  const { t } = await useTranslation(lang, "EventPage");
  const headerLayoutClassName = stickyOverlay
    ? "sticky top-0 left-0 right-0 z-30"
    : "";

  return (
    <header className={cn("w-full", headerLayoutClassName, className)}>
      <div className="mx-auto flex w-full items-center justify-between px-4 py-4 md:px-16">
        <div className="flex-1">
          <Link href={`/${eventSlug}`}>
            <CreativeContactLogo className="h-8 w-auto fill-muted sm:h-12 md:h-16" />
          </Link>
        </div>
        <div className="hidden flex-1 justify-center lg:flex">
          {/* Desktop menu */}
          <div className="space-x-4">
            <Link
              href={`/${eventSlug}`}
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
            <Link
              href={`https://creativecontact.vn`}
              className="px-4 py-2 font-bold text-muted hover:bg-transparent hover:text-muted-foreground"
            >
              {t("about", { ns: "EventPage" })}
            </Link>
          </div>
        </div>
        <div className="hidden flex-1 justify-end lg:flex">
          {/* Desktop buttons */}
          <div className="flex flex-row space-x-4">
            <Button
              variant="outline"
              className="relative inset-0 overflow-hidden rounded-full border-accent bg-accent/5 font-bold text-accent shadow-inner shadow-accent-500/50 transition-shadow duration-500 hover:shadow-md hover:shadow-accent-500/50"
              asChild
            >
              <Link href={`/${eventSlug}/upload`}>
                {t("upload", { ns: "EventPage" })}
              </Link>
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
  );
};
