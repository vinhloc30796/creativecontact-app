import CreativeContactLogo, { LogoVariant } from "@/components/branding/CreativeContactLogo";
import { TextIconBox } from "@/components/text-icon-box";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  t: (key: string) => string;
  className?: string;
  stickyOverlay?: boolean;
}

export function Header({ t, className, stickyOverlay = true }: HeaderProps) {
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
        <div className="flex items-center">
          <Button
            variant="link"
            asChild
            className="text-sm text-foreground hover:text-sunglow"
          >
            <Link href="/signup">
              <TextIconBox
                title={t("joinUsLine1")}
                subtitle={t("joinUsLine2")}
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
      </div>
    </header>
  );
}
