import CreativeContactLogo, { LogoVariant } from "@/components/branding/CreativeContactLogo";
import { TextIconBox } from "@/components/text-icon-box";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  t: (key: string) => string;
}

export function Header({ t }: HeaderProps) {
  return (
    <header className="flex w-full items-center justify-between py-4 pl-12 pr-4">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center">
          <CreativeContactLogo
            variant={LogoVariant.FULL}
            width={80}
            height={50}
            className="text-foreground hover:text-sunglow transition-colors"
          />
        </Link>
      </div>

      <div className="flex items-center justify-stretch p-0 m-0">
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
    </header>
  );
}
