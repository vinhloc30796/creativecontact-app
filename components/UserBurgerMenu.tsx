"use server"

import { useTranslation } from "@/lib/i18n/init-server";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface UserBurgerMenuProps {
  lang: string;
}

const UserBurgerMenu: React.FC<UserBurgerMenuProps> = async ({ lang }) => {
  const { t } = await useTranslation(lang, "UserPage");

  return (
    <div>
      <button className="text-primary p-2">
        <Menu className="w-6 h-6" />
      </button>
      <div className="fixed inset-x-0 top-24 bottom-0 z-40 bg-primary-1000 flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-4">
          <Link
            href="/about"
            className="block w-full text-center py-4 text-2xl text-primary hover:text-primary-foreground hover:bg-primary/10"
          >
            {t("about", { ns: "UserPage" })}
          </Link>
          <Button variant="ghost" className="w-full mt-4 py-4 text-xl text-primary hover:text-primary-foreground hover:bg-primary/10" asChild>
            <Link href="/logout">{t("logout", { ns: "UserPage" })}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserBurgerMenu;