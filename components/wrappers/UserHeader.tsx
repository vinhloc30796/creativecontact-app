"use server";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/init-server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import CreativeContactLogo from "@/components/branding/CreativeContactLogo";
import UserBurgerMenu from "@/components/UserBurgerMenu";

interface UserHeaderProps {
  lang: string;
  className?: string;
  stickyOverlay?: boolean;
  isLoggedIn: boolean; // New prop to check if user is logged in
}

export const UserHeader: React.FC<UserHeaderProps> = async ({
  lang,
  className,
  stickyOverlay = true,
  isLoggedIn, // Add the new prop to the component parameters
}) => {
  const { t } = await useTranslation(lang, "UserPage");
  const headerLayoutClassName = stickyOverlay
    ? "sticky top-0 left-0 right-0 z-30"
    : "";

  return (
    <header className={cn("w-full flex", headerLayoutClassName, className)}>
      <div className="mx-auto flex w-full px-4 py-4 md:px-16 gap-4">
        <div className="flex-1">
          <Link href="/">
            <CreativeContactLogo className="h-8 w-auto sm:h-12 md:h-16" />
          </Link>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="hidden flex-1 justify-start lg:flex">
            {/* Desktop menu */}
            <div className="space-x-4">
              <Link
                href="/about"
                className="px-4 py-2 font-bold text-primary hover:bg-transparent hover:text-primary-500"
              >
                <span
                  style={{
                    textShadow: `hsl(var(--primary)) 0px 0px 10px`,
                  }}
                >
                  {t("about", { ns: "UserPage" })}
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden flex-1 justify-end lg:flex">
            {/* Desktop buttons */}
            <div className="flex flex-row space-x-4">
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  className="font-bold text-primary hover:bg-primary/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/logout">{t("logout", { ns: "UserPage" })}</Link>
                </Button>
              ) : (
                <div>
                  <Button
                    variant="ghost"
                    className="font-bold text-primary hover:bg-primary/10 hover:text-primary-foreground mr-2"
                    asChild
                  >
                    <Link href="/login">{t("login", { ns: "UserPage" })}</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="font-bold text-primary hover:bg-primary/10 hover:text-primary-foreground"
                    asChild
                  >
                    <Link href="/signup">{t("signup", { ns: "UserPage" })}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="lg:hidden">
            <UserBurgerMenu lang={lang} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </header>
  );
};
