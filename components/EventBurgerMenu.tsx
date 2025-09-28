"use client"

import { useTranslation } from "@/lib/i18n/init-client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AboutEventDialog from "@/components/event/AboutEventDialog";
import { getEventAbout } from "@/lib/events/getEventAbout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface EventBurgerMenuProps {
  lang: string;
  eventSlug: string;
}

const EventBurgerMenu: React.FC<EventBurgerMenuProps> = ({ lang, eventSlug }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(lang, "EventPage");
  const { isLoggedIn, isAnonymous, isLoading } = useAuth();
  const router = useRouter();
  // Note: Data is fetched on the server in EventHeader and passed via props ideally.
  // For now, we compute it client-side by reading i18n fallback only to avoid client CMS calls.
  const aboutFallback = {
    title: t(`EventAbout.${eventSlug}.title`, { defaultValue: "Creative Contact Event" }),
    body: t(`EventAbout.${eventSlug}.body`, { defaultValue: "" }),
    igUrl: t(`EventAbout.${eventSlug}.igUrl`, { defaultValue: "" }) || undefined,
    fbUrl: t(`EventAbout.${eventSlug}.fbUrl`, { defaultValue: "" }) || undefined,
    ctaText: t(`EventAbout.${eventSlug}.ctaText`, { defaultValue: "" }) || undefined,
    ctaHref: `/event/${eventSlug}`,
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      <button onClick={toggleMenu} className="text-primary p-2">
        <Menu className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="fixed inset-x-0 top-24 bottom-0 z-40 bg-primary-1000 flex flex-col items-center justify-center">
          <div className="w-full max-w-md px-4">
            <Link
              href={`/event/${eventSlug}`}
              className="block w-full text-center py-4 text-2xl text-primary hover:text-primary-foreground hover:bg-primary/10"
            >
              {t("gallery", { ns: "EventPage" })}
            </Link>
            <AboutEventDialog
              trigger={
                <button className="block w-full text-center py-4 text-2xl text-muted hover:text-muted-foreground hover:bg-muted/10">
                  {t("about", { ns: "EventPage" })}
                </button>
              }
              eventSlug={eventSlug}
              title={aboutFallback.title}
              body={aboutFallback.body}
              ctaText={aboutFallback.ctaText}
            />
            <Button
              variant="outline"
              className="w-full mt-6 py-4 text-xl text-accent rounded-full border-accent bg-accent/5 shadow-inner shadow-accent-500/50 hover:shadow-md hover:shadow-accent-500/50 transition-shadow duration-500 relative overflow-hidden"
              onClick={() => {
                const isAuthed = isLoggedIn && !isAnonymous;
                setIsOpen(false);
                if (isAuthed) {
                  router.push(`/event/${eventSlug}/upload`);
                } else {
                  router.push(`/login`);
                }
              }}
              aria-label={isLoading ? "..." : (isLoggedIn && !isAnonymous ? t("upload", { ns: "EventPage" }) : t("login", { ns: "EventPage" }))}
            >
              {isLoading
                ? "..."
                : (isLoggedIn && !isAnonymous
                  ? t("upload", { ns: "EventPage" })
                  : t("login", { ns: "EventPage" }))}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBurgerMenu;