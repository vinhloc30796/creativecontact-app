import CreativeContactLogo, { LogoVariant } from "@/components/branding/CreativeContactLogo";
import { CtaLinkButton } from "@/components/cta/CtaLinkButton";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeaderProps {
  t: (key: string) => string;
  className?: string;
  stickyOverlay?: boolean;
}

export function Header({ t, className, stickyOverlay = true }: HeaderProps) {
  const headerLayoutClassName = stickyOverlay
    ? "fixed top-0 left-0 right-0 z-30"
    : "";

  return (
    <>
      <header
        className={cn("w-full flex items-center", headerLayoutClassName, className)}
        style={{ ["--cc-header-h" as any]: "80px" }}
      >
        <div className="mx-auto flex w-full items-center justify-between px-4 py-4 md:px-16">
          <div>
            <Link href="/">
              <CreativeContactLogo variant={LogoVariant.FULL} width={80} height={50} />
            </Link>
          </div>
          <CtaLinkButton
            href="/signup"
            title={t("joinUsLine1")}
            subtitle={t("joinUsLine2")}
          />
        </div>
      </header>
      {stickyOverlay && (
        <div aria-hidden className="w-full" style={{ height: "var(--cc-header-h, 80px)" }} />
      )}
    </>
  );
}
