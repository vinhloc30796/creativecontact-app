import { Metadata } from "next";
import Link from "next/link";
import { JSX, SVGProps } from "react";

import { ClientNavMenu } from "@/components/ClientNavMenu";
import { EventTicker } from "@/components/events/EventTicker";
import { Header } from "@/components/Header";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RotatingWord } from "@/components/RotatingWord";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H2, HeroTitle, Lead, P } from "@/components/ui/typography";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { getServerTranslation } from "@/lib/i18n/init-server";

export const metadata: Metadata = {
  title: "About | Creative Contact",
  description:
    "Learn about Creative Contact's mission, vision, and the team behind our creative community.",
};

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  // The lang query param overrides default 'en'
  const { lang = "en" } = await searchParams

  // Load both the shared navigation namespace and the page-specific namespace
  const { t } = await getServerTranslation(lang, ["HomePage", "AboutPage"]);

  return (
    <BackgroundDiv shouldCenter={false} className="flex min-h-screen flex-col">
      {/* Shared site header */}
      <Header t={t} stickyOverlay={false} />

      {/* Sticky control bar (language switcher + nav), row layout full width, centered vertically */}
      <div className="fixed inset-x-0 top-1/2 z-40 -translate-y-1/2 flex w-full items-center justify-between px-4 md:px-8">
        <LanguageSwitcher currentLang={lang} />

        <ClientNavMenu
          items={[
            { text: t("aboutCC"), href: "/about" },
            { text: t("contactBook"), href: "/contacts" },
            { text: t("event"), href: "/events" },
          ]}
          menuText={t("menu")}
        />
      </div>

      {/* Main content */}
      <div className="relative z-0 flex flex-1 flex-col">
        {/* Header section */}
        <div className="flex h-[30vh] max-h-[30vh] flex-col justify-center px-12">
          <HeroTitle className="whitespace-pre-line font-bold" size="medium">
            {t("AboutPage:heroTitle")}
          </HeroTitle>
        </div>

        {/* Content section */}
        <div className="flex-1 space-y-10 overflow-y-auto px-12 pb-12">
          {/* Hook section */}
          <Lead className="whitespace-pre-line text-xl text-foreground/90 md:text-2xl">
            {t("AboutPage:hookBefore")}
            <RotatingWord
              words={t("AboutPage:hookWords", { returnObjects: true }) as string[]}
              className="text-sunglow"
            />
            {t("AboutPage:hookAfter")}
          </Lead>

          <Separator className="bg-white/10" />

          {/* Project Purpose Section */}
          <div className="mt-12">
            <H2 className="text-foreground/90">{t("AboutPage:whatIsCCTitle")}</H2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <P className="text-foreground/80">
                  {t("AboutPage:whatIsCCParagraphOne")}
                </P>
                <ul className="list-disc space-y-2 pl-5 text-foreground/80">
                  <li>{t("AboutPage:whatIsCCListDo")}</li>
                  <li>{t("AboutPage:whatIsCCListLearn")}</li>
                  <li>{t("AboutPage:whatIsCCListFindJob")}</li>
                </ul>

                <P className="text-foreground/80">
                  {t("AboutPage:whatIsCCParagraphTwo.part1")}
                  <Link href="/contacts" className="underline decoration-sunglow hover:text-sunglow">
                    {t("AboutPage:connectLinkText")}
                  </Link>
                  {t("AboutPage:whatIsCCParagraphTwo.part2")}
                </P>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-auto">
                <div className="absolute inset-0 bg-linear-to-r from-sunglow/20 to-purple-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">
                    {t("AboutPage:formulaQuote")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspirational Quote Section */}
          <div className="mt-16 -mx-12 overflow-hidden">
            <div className="flex w-screen animate-marquee whitespace-nowrap py-2 text-lg font-semibold text-sunglow">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <span key={i} className="mx-6">
                    {t("AboutPage:marqueeQuote")}
                  </span>
                ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mt-16">
            <H2 className="text-foreground/90">{t("AboutPage:meetTeamTitle")}</H2>
            <P className="mt-2 text-foreground/70">
              {t("AboutPage:meetTeamSubtitle")}
            </P>

            <div className="mt-6 grid gap-6 md:grid-cols-4">
              {/* Team members */}
              {[
                "Khải Hoàn",
                "Vĩnh Lộc",
                "Chi Nguyễn",
                "Minh Tâm",
                "Ngọc Huế",
                "Song Như",
                "Annie This",
                "Annie That",
                "Khánh Ly",
                "Tuyết Như",
                "Đức Mạnh",
                "Minh Hạnh",
              ].map((memberName, i) => (
                <div
                  key={i}
                  className="relative rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xs"
                >
                  {/* Construction banner */}
                  <div className="absolute left-0 right-0 top-0 flex items-center justify-center gap-2 rounded-t-lg bg-sunglow px-2 py-1">
                    <ConstructionIcon className="h-5 w-5 text-black" />
                    <span className="text-xs font-medium text-black">
                      {t("AboutPage:constructionBanner")}
                    </span>
                  </div>

                  {/* Profile content */}
                  <div className="mt-6">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-md bg-white/10">
                      <span className="text-4xl font-bold text-white/50">
                        {memberName.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-foreground">
                      {memberName}
                    </h3>
                    <p className="text-sm text-foreground/70">{t("AboutPage:memberRole")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Invitation Section */}
          <div
            className="relative mt-20 flex w-full flex-col items-center justify-center gap-6 rounded-3xl border-4 border-black bg-sunglow p-10 text-center shadow-[4px_4px_0_0_#000] transition-transform md:-rotate-1 md:hover:rotate-0"
          >
            <H2 className="text-3xl font-bold text-black md:text-4xl">
              {t("AboutPage:adTitle")}
            </H2>
            <P className="max-w-2xl text-lg font-medium text-black md:text-xl">
              {t("AboutPage:adText")}
            </P>

            <Button
              asChild
              className="rounded-full border-2 border-black bg-black px-8 py-4 font-semibold text-sunglow transition-colors hover:bg-white hover:text-black"
            >
              <Link href={`mailto:creative.contact.vn@gmail.com?subject=${t("AboutPage:emailSubject")}`}>{t("AboutPage:connectNow")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer ticker using shared EventTicker for style consistency */}
      <footer className="w-full text-black">
        <EventTicker
          eventName={t("AboutPage:footerEventName")}
          tickerText={t("AboutPage:footerTickerText")}
          repetitions={4}
          speed={30}
        />
      </footer>
    </BackgroundDiv>
  );
}

// Construction icon component
function ConstructionIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="8" rx="1" />
      <path d="M17 14v7" />
      <path d="M7 14v7" />
      <path d="M17 3v3" />
      <path d="M7 3v3" />
      <path d="M10 14 2.3 6.3" />
      <path d="m14 6 7.7 7.7" />
      <path d="m8 6 8 8" />
    </svg>
  );
}
