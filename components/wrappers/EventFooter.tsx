"use server";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n/init-server";

interface EventFooterProps {
  className?: string;
  lang: string;
}

export const EventFooter: React.FC<EventFooterProps> = async ({
  className,
  lang = 'en',
}) => {
  const { t } = await useTranslation(lang, "common");

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 w-full bg-primary-1000/80 shadow-md",
        className,
      )}
    >
      <div className="container mx-auto flex w-full items-center justify-between px-4 py-4 text-muted-foreground">
        <div className="text-left flex items-center">
          <Link
            href={`?lang=en`}
            className={`transition-colors duration-300 hover:text-primary-foreground ${lang === 'en' ? 'text-primary font-black' : 'font-bold'}`}
          >
            EN
          </Link>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Link
            href={`?lang=vi`}
            className={`transition-colors duration-300 hover:text-primary-foreground ${lang === 'vi' ? 'text-primary font-black' : 'font-bold'}`}
          >
            VI
          </Link>
        </div>
        <div className="text-center">
          © {new Date().getFullYear()} Creative Contact
        </div>
        <div className="text-right">
          <Link
            href="https://www.facebook.com/creativecontact.vn"
            className="mr-4 font-bold transition-colors duration-300 hover:text-primary-foreground"
          >
            FB
          </Link>
          <Link
            href="https://instagram.com/creativecontact_vn"
            className="font-bold transition-colors duration-300 hover:text-primary-foreground"
          >
            IG
          </Link>
        </div>
      </div>
    </footer>
  );
};
