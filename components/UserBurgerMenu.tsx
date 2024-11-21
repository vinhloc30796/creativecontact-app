"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/init-client";
import { Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface UserBurgerMenuProps {
  lang: string;
  isLoggedIn: boolean;
}

export const UserBurgerMenu: React.FC<UserBurgerMenuProps> = ({
  lang,
  isLoggedIn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(lang, "UserPage");

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      <button onClick={toggleMenu} className="p-2 text-primary">
        <Menu className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 top-24 z-40 flex flex-col items-center justify-center bg-primary-1000">
          <div className="w-full max-w-md px-4">
            <Link
              href="/about"
              className="block w-full py-4 text-center text-2xl text-primary hover:bg-primary/10 hover:text-primary-foreground"
            >
              {t("about")}
            </Link>
            {isLoggedIn ? (
              <Button
                variant="ghost"
                className="mt-4 w-full py-4 text-xl text-primary hover:bg-primary/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/logout">{t("logout")}</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="mt-4 w-full py-4 text-xl text-primary hover:bg-primary/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/signup">{t("signup")}</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="mt-4 w-full py-4 text-xl text-primary hover:bg-primary/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/login">{t("login")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
