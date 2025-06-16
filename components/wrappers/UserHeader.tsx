import CreativeContactLogo, { LogoVariant } from "@/components/branding/CreativeContactLogo";
import { Button } from "@/components/ui/button";
import { UserBurgerMenu } from "@/components/UserBurgerMenu";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { use } from "react";
import { TextIconBox } from "@/components/text-icon-box";
import { ArrowUpRight } from "lucide-react";

interface UserHeaderProps {
  lang: string;
  className?: string;
  stickyOverlay?: boolean;
  isLoggedIn: boolean;
}

export async function UserHeader({
  lang,
  className,
  stickyOverlay = true,
  isLoggedIn,
}: UserHeaderProps) {
  const { t: tUser } = await getServerTranslation(lang, "UserPage");
  const { t: tHome } = await getServerTranslation(lang, "HomePage");

  const headerLayoutClassName = stickyOverlay
    ? "sticky top-0 left-0 right-0 z-30"
    : "";

  return (
    <header className={cn("w-full flex items-center", headerLayoutClassName, className)}>
      <div className="mx-auto flex w-full items-center justify-between px-4 py-4 md:px-16">
        <div>
          <Link href="/">
            <CreativeContactLogo variant={LogoVariant.FULL} width={80} height={50} />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div className="hidden flex-1 items-center justify-end lg:flex">
            {/* Desktop buttons */}
            <div className="flex flex-row space-x-4">
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  className="h-[50px] font-bold text-primary hover:bg-primary/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/logout">{tUser("logout")}</Link>
                </Button>
              ) : (
                <div className="flex flex-row space-x-2">
                  <Button
                    variant="link"
                    asChild
                    className="h-[50px] text-sm text-foreground hover:text-sunglow"
                  >
                    <Link href="/signup">
                      <TextIconBox
                        title={tHome("joinUsLine1")}
                        subtitle={tHome("joinUsLine2")}
                        icon={
                          <ArrowUpRight
                            className="text-sunglow"
                            style={{ height: "125%", width: "125%" }}
                          />
                        }
                        className="text-sm"
                      />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="lg:hidden ml-auto">
            <UserBurgerMenu lang={lang} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </header>
  );
};
