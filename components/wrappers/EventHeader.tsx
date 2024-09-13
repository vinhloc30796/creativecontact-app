import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/init-server';
import { cn } from '@/lib/utils'; // Import the cn utility function

interface EventHeaderProps {
  eventSlug: string;
  lang: string;
  className?: string; // Add className prop
  stickyOverlay?: boolean;
}

const EventHeader: React.FC<EventHeaderProps> = async ({ eventSlug, lang, className, stickyOverlay = true }) => {
  const { t } = await useTranslation(lang, "EventPage");
  const headerLayoutClassName = stickyOverlay ? "sticky top-0 left-0 right-0 z-30" : "";

  return (
    <header className={cn("w-full", headerLayoutClassName, className)}> {/* Apply className prop */}
      <div className="w-full mx-auto py-4 px-16 flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary-foreground">Creative Contact</h1>
        </div>
        <div className="flex-1 text-center">
          <div className="space-x-4">
            <Button variant="secondary" disabled>
              {t("about", { ns: "EventPage" })}
            </Button>
            <Button variant="secondary" asChild>
              <Link href={`/${eventSlug}`}>{t("gallery", { ns: "EventPage" })}</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="flex flex-row justify-end space-x-4">
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
      </div>
    </header>
  );
};

export default EventHeader;
