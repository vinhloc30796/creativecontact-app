import { EventSlot } from "@/app/types/EventSlot";
import InConstruct from "@/components/InConstruction";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EventTicker } from "@/components/events/EventTicker";
import { TextIconBox } from "@/components/text-icon-box";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HeroTitle, Lead } from "@/components/ui/typography";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { eventSlots } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { eq } from "drizzle-orm";
import { ArrowUpRight, Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { ClientNavMenu } from "../components/ClientNavMenu";
import { HoverableCreativesTitle } from "@/components/contacts/HoverableCreativesTitle";
import { HoverableContactTitle } from "@/components/contacts/HoverableContactTitle";
import CreativeContactLogo, { LogoVariant } from "@/components/branding/CreativeContactLogo";
import { ThumbnailImage } from "@/components/ThumbnailImage";

// show the in-construction page
const inConstructPage = false;

async function getCurrentEvent(): Promise<string> {
  // @TODO: get the current event from the database
  return "[IN CONSTRUCTION]";
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

      {/* Main content split into two sections */}
      <div className="relative z-0 flex flex-1 flex-col">
        {/* Hero section - takes up at most half the screen height */}
        <div className="flex h-[50vh] max-h-[50vh] flex-col justify-center px-12">
          <div className="flex w-full flex-col">
            <HoverableContactTitle
              titleText={t("titleContact")}
              events={[
                // 2023 events (chronological order)
                { title: "Launch Party", datetime: new Date(2023, 2, 15, 19, 0) },
                { title: "Spring Workshop", datetime: new Date(2023, 3, 10, 14, 0) },
                { title: "Art Exhibition", datetime: new Date(2023, 5, 22, 18, 0) },
                { title: "Summer Meetup", datetime: new Date(2023, 6, 18, 16, 30) },
                { title: "Creative Hackathon", datetime: new Date(2023, 8, 5, 9, 0) },
                { title: "Fall Showcase", datetime: new Date(2023, 9, 28, 17, 0) },
                { title: "Year-End Celebration", datetime: new Date(2023, 11, 15, 20, 0) },
                // 2024 events (chronological order)
                { title: "Workshop", datetime: new Date(2024, 4, 15, 14, 0) },
                { title: "Exhibition", datetime: new Date(2024, 4, 20, 18, 30) },
                { title: "Networking", datetime: new Date(2024, 5, 5, 19, 0) },
                { title: "Networking #2", datetime: new Date(2024, 7, 12, 19, 0) },
                { title: "Exhibition #2", datetime: new Date(2024, 8, 12, 19, 0) },
                { title: "Boardgames #2", datetime: new Date(2024, 9, 12, 19, 0) },
                // 2025 events (chronological order)
                { title: "Boardgames", datetime: new Date(2025, 6, 6, 22, 0) },
                { title: "Workshop #2", datetime: new Date(2025, 6, 10, 14, 0) },
              ]}
              contentId="subtitle-content"
            />
            <div className="w-fit self-end">
              <HoverableCreativesTitle>
                <Link href="/contacts">
                  <HeroTitle className="text-hover-border font-bold" size="default">
                    {t("titleCreatives")}
                  </HeroTitle>
                </Link>
              </HoverableCreativesTitle>
            </div>
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
                { text: t("event"), href: "/events" },
              ]}
              menuText={t("menu")}
            />
          </div>
        </div>

        {/* Content section - fills the remaining space */}
        <div className="flex-1 space-y-10 overflow-y-auto px-12 pb-12" id="subtitle-content">
          {/* Description text */}
          <Lead
            id="subtitle-content"
            className="whitespace-pre-line text-xl text-foreground/90 mt-4 md:text-2xl"
          >
            {t("subtitle")}
          </Lead>
          {/* Floating gradient background using ThumbnailImage component */}
          <ThumbnailImage
            width={320}
            height={180}
            interval={10000}
            className="absolute bottom-0 right-12 z-40"
          />
        </div>
      </div>

      {/* Event ticker at the bottom */}
      <footer className="w-full overflow-hidden text-black relative z-50">
        {/* Social media links - positioned at bottom left above the footer */}
        <div className="mb-8 ml-12 flex flex-col gap-y-8 py-4 w-fit">
          <a
            href="https://www.facebook.com/creativecontact.vn"
            className="text-foreground transition-colors hover:text-sunglow"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://instagram.com/creativecontact_vn"
            className="text-foreground transition-colors hover:text-sunglow"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://www.linkedin.com/company/creativecontact-vn"
            className="text-foreground transition-colors hover:text-sunglow"
          >
            <Linkedin size={24} />
          </a>
        </div>



        {/* Event ticker */}
        <EventTicker
          eventName={currentEvent}
          tickerText={t("ticker")}
          repetitions={6}
          pauseOnHover={true}
          direction="left"
        />
      </footer>
    </BackgroundDiv>
  );
}

export const dynamic = "force-dynamic";
