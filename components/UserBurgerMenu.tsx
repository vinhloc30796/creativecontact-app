"use client"

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/init-client";
import { Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface UserBurgerMenuProps {
  lang: string;
  isLoggedIn: boolean;
}

export const UserBurgerMenu: React.FC<UserBurgerMenuProps> = ({ lang, isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(lang, "UserPage");

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
              href="/about"
              className="block w-full text-center py-4 text-2xl text-primary hover:text-primary-foreground hover:bg-primary/10"
            >
              {t("about")}
            </Link>
            {isLoggedIn ? (
              <Button variant="ghost" className="w-full mt-4 py-4 text-xl text-primary hover:text-primary-foreground hover:bg-primary/10" asChild>
                <Link href="/logout">{t("logout")}</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="w-full mt-4 py-4 text-xl text-primary hover:text-primary-foreground hover:bg-primary/10" asChild>
                  <Link href="/signup">{t("signup")}</Link>
                </Button>
                <Button variant="ghost" className="w-full mt-4 py-4 text-xl text-primary hover:text-primary-foreground hover:bg-primary/10" asChild>
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
