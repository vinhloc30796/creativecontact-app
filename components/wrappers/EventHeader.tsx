"use server";

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/init-server';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import CreativeContactLogo from '@/components/branding/CreativeContactLogo';
import BurgerMenu from '@/components/BurgerMenu';

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
  const headerLayoutClassName = stickyOverlay ? "sticky top-0 left-0 right-0 z-30" : "";

  return (
    <header className={cn("w-full", headerLayoutClassName, className)}>
      <div className="w-full mx-auto py-4 px-4 md:px-16 flex justify-between items-center">
        <div className="flex-1">
          <Link href={`/${eventSlug}`}>
            <CreativeContactLogo className="fill-muted h-8 sm:h-12 md:h-16 w-auto" />
          </Link>
        </div>
        <div className="hidden lg:flex flex-1 justify-center">
          {/* Desktop menu */}
          <div className="space-x-4">
            <Link 
              href={`/${eventSlug}`}
              className="px-4 py-2 text-primary hover:text-primary-foreground hover:bg-transparent"
            >
              <span style={{ textShadow: `hsl(var(--primary-foreground)) 0px 0px 10px` }}>
                {t("gallery", { ns: "EventPage" })}
              </span>
            </Link>
            <Link 
              href={`https://creativecontact.vn`}
              className="px-4 py-2 text-muted hover:text-muted-foreground hover:bg-transparent"
            >
              {t("about", { ns: "EventPage" })}
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 justify-end">
          {/* Desktop buttons */}
          <div className="flex flex-row space-x-4">
            <Button
              variant="outline"
              className="inset-0 text-accent rounded-full border-accent bg-accent/5 shadow-inner shadow-accent-500/50 hover:shadow-md hover:shadow-accent-500/50 transition-shadow duration-500 relative overflow-hidden"
              asChild
            >
              <Link href={`/${eventSlug}/upload`}>{t("upload", { ns: "EventPage" })}</Link>
            </Button>
            <p>
              <Button variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary/10" asChild>
                <Link href="/signup">{t("signup", { ns: "EventPage" })}</Link>
              </Button>
              <span className="text-primary">|</span>
              <Button variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary/10" asChild>
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
