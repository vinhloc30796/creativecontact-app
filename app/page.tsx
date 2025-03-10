import { EventSlot } from "@/app/types/EventSlot";
import InConstruct from "@/components/InConstruction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HeroTitle, Lead, P, Small } from "@/components/ui/typography";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { eventSlots } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { eq } from "drizzle-orm";
import { Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ClientNavMenu } from "../components/ClientNavMenu";
import { TextIconBox } from "@/components/text-icon-box";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// show the in-construction page
const inConstructPage = false;

async function getCurrentEvent(): Promise<string> {
  // @TODO: get the current event from the database
  return "HOAN TAT 2";
}

async function getEventSlots(event: string): Promise<EventSlot[]> {
  console.debug("Pulling event slots for event", event);
  const results = (
    await db.select().from(eventSlots).where(eq(eventSlots.event, event))
  ).map((slot) => slot as EventSlot);
  console.debug(`Got ${results.length} event slots`);
  return results;
}
interface Props {
  searchParams: Promise<{
    lang?: string;
  }>;
}
export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const lang = searchParams.lang || "en";
  const currentEvent = await getCurrentEvent();
  const { t } = await getServerTranslation(lang, "HomePage");

  if (inConstructPage) {
    return (
      <BackgroundDiv>
        <InConstruct lang={lang} />
      </BackgroundDiv>
    );
  }

  return (
    <BackgroundDiv shouldCenter={false} className="flex h-screen flex-col">
      {/* Header with logo and join button */}
      <header className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 p-1"
          >
            <span className="text-xl font-bold text-black">CC</span>
          </Link>
        </div>

        <div className="flex items-center">
          <Button
            variant="link"
            asChild
            className="text-sm text-foreground hover:text-yellow-400"
          >
            <Link href="/signup">
              <TextIconBox
                title={t("joinUsLine1")}
                subtitle={t("joinUsLine2")}
                icon={
                  <ArrowUpRight
                    className="text-yellow-400"
                    style={{ height: "125%", width: "125%" }}
                  />
                }
                className="text-sm"
              />
            </Link>
          </Button>
        </div>
      </header>

      {/* Main content split into two sections */}
      <div className="relative z-0 flex flex-1 flex-col">
        {/* Header section - takes up at most half the screen height */}
        <div className="flex h-[50vh] max-h-[50vh] flex-col justify-center px-12">
          <div className="flex flex-col w-full">
            <Link href="/events" className="w-fit self-start">
              <HeroTitle
                className="font-bold text-hover-border"
                size="default"
              >
                {t("titleContact")}
              </HeroTitle>
            </Link>
            <Link href="/contacts" className="w-fit self-end">
              <HeroTitle
                className="font-bold text-hover-border"
                size="default"
              >
                {t("titleCreatives")}
              </HeroTitle>
            </Link>
          </div>

          {/* Translation and navigation row moved below title */}
          <div className="flex w-full items-center justify-between py-6">
            {/* Language switcher on left */}
            <div className="flex gap-2">
              <LanguageSwitcher currentLang={lang} />
            </div>

            {/* Navigation menu items on right */}
            <ClientNavMenu
              items={[
                { text: t("aboutCC"), href: "/about" },
                { text: t("contactBook"), href: "/contacts" },
                { text: t("event"), href: "/events" }
              ]}
              menuText={t("menu")}
            />
          </div>
        </div>

        {/* Content section - fills the remaining space */}
        <div className="flex-1 space-y-10 overflow-y-auto px-12 pb-12">
          {/* Description text */}
          <Lead className="whitespace-pre-line text-xl text-foreground/90 md:text-2xl">
            {t("subtitle")}
          </Lead>

          <Separator className="bg-white/10" />

          {/* Social media links */}
          <div>
            <Small className="mb-3 block text-foreground/70">
              {t("followUs")}
            </Small>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full p-0 hover:bg-white/10"
              >
                <a
                  href="#"
                  className="text-foreground transition-colors hover:text-yellow-400"
                >
                  <Facebook size={24} />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full p-0 hover:bg-white/10"
              >
                <a
                  href="#"
                  className="text-foreground transition-colors hover:text-yellow-400"
                >
                  <Instagram size={24} />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full p-0 hover:bg-white/10"
              >
                <a
                  href="#"
                  className="text-foreground transition-colors hover:text-yellow-400"
                >
                  <Linkedin size={24} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Event ticker at the bottom */}
      <footer className="w-full overflow-hidden bg-yellow-400 py-3 text-black">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className="mx-4 text-base font-medium"
              >{`${currentEvent} ${t("ticker")}`}</span>
            ))}
        </div>
      </footer>
    </BackgroundDiv>
  );
}
