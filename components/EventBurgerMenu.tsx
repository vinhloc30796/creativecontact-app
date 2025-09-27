"use client"

import { useTranslation } from "@/lib/i18n/init-client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AboutEventDialog from "@/components/event/AboutEventDialog";

interface EventBurgerMenuProps {
  lang: string;
  eventSlug: string;
}

const EventBurgerMenu: React.FC<EventBurgerMenuProps> = ({ lang, eventSlug }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(lang, "EventPage");

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
              title="Trung Thu Creative Archive"
              body={
                "Trung Thu Creative Archive (TTCA) là nơi lưu giữ và lan tỏa các tác phẩm, ý tưởng và câu chuyện về Trung thu do cộng đồng tất cả các ngành sáng tạo cùng đóng góp."
              }
              igUrl="https://instagram.com/creativecontact.vn"
              fbUrl="https://facebook.com/creativecontact.vn"
              ctaText="Về TTCA"
              ctaHref={`/event/${eventSlug}`}
            />
            <Button
              variant="outline"
              className="w-full mt-6 py-4 text-xl text-accent rounded-full border-accent bg-accent/5 shadow-inner shadow-accent-500/50 hover:shadow-md hover:shadow-accent-500/50 transition-shadow duration-500 relative overflow-hidden"
              asChild
            >
              <Link href={`/event/${eventSlug}/upload`}>{t("upload", { ns: "EventPage" })}</Link>
            </Button>
            <Button variant="ghost" className="w-full mt-4 py-4 text-xl text-primary hover:text-primary-foreground hover:bg-primary/10" asChild>
              <Link href="/signup">{t("signup", { ns: "EventPage" })}</Link>
            </Button>
            <Button variant="ghost" className="w-full mt-4 py-4 text-xl text-primary hover:text-primary-foreground hover:bg-primary/10" asChild>
              <Link href="/login">{t("login", { ns: "EventPage" })}</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBurgerMenu;