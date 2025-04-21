import { EventSlot } from "@/app/types/EventSlot";
import { HoverableContactTitle } from "@/components/contacts/HoverableContactTitle";
import { HoverableCreativesTitle } from "@/components/contacts/HoverableCreativesTitle";
import { EventTicker } from "@/components/events/EventTicker";
import { Header } from "@/components/Header";
import InConstruct from "@/components/InConstruction";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThumbnailImage } from "@/components/ThumbnailImage";
import { HeroTitle, Lead } from "@/components/ui/typography";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { ClientFloatingActions } from "@/components/ClientFloatingActions";
import { eventSlots } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { eq } from "drizzle-orm";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { fetchEvents } from "@/lib/payload/fetchEvents";
import { ClientNavMenu } from "../components/ClientNavMenu";

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

  // Mock events: similar shape to payload events
  const mockEvents = [
    {
      title: "Launch Party",
      datetime: new Date(2023, 2, 15, 19, 0),
      source: "mock",
    },
    {
      title: "Spring Workshop",
      datetime: new Date(2023, 3, 10, 14, 0),
      source: "mock",
    },
    {
      title: "Art Exhibition",
      datetime: new Date(2023, 5, 22, 18, 0),
      source: "mock",
    },
    {
      title: "Summer Meetup",
      datetime: new Date(2023, 6, 18, 16, 30),
      source: "mock",
    },
    {
      title: "Creative Hackathon",
      datetime: new Date(2023, 8, 5, 9, 0),
      source: "mock",
    },
    {
      title: "Fall Showcase",
      datetime: new Date(2023, 9, 28, 17, 0),
      source: "mock",
    },
    {
      title: "Year-End Celebration",
      datetime: new Date(2023, 11, 15, 20, 0),
      source: "mock",
    },
    {
      title: "Workshop",
      datetime: new Date(2024, 4, 15, 14, 0),
      source: "mock",
    },
    {
      title: "Exhibition",
      datetime: new Date(2024, 4, 20, 18, 30),
      source: "mock",
    },
    {
      title: "Networking",
      datetime: new Date(2024, 5, 5, 19, 0),
      source: "mock",
    },
    {
      title: "Networking #2",
      datetime: new Date(2024, 7, 12, 19, 0),
      source: "mock",
    },
    {
      title: "Exhibition #2",
      datetime: new Date(2024, 8, 12, 19, 0),
      source: "mock",
    },
    {
      title: "Boardgames #2",
      datetime: new Date(2024, 9, 12, 19, 0),
      source: "mock",
    },
    {
      title: "Boardgames",
      datetime: new Date(2025, 6, 6, 22, 0),
      source: "mock",
    },
    {
      title: "Workshop #2",
      datetime: new Date(2025, 6, 10, 14, 0),
      source: "mock",
    },
  ];

  // Fetch real events from payload
  const realEvents = await fetchEvents({
    sort: "eventDate",
    where: { status: { not_equals: "draft" } },
  });

  const combinedEvents = [
    ...mockEvents.map((e: any) => ({
      ...e,
      isPlaceholder: true,
    })),
    ...realEvents.map((e: any) => ({
      ...e,
      datetime: new Date(e.eventDate),
      isPlaceholder: false,
    })),
  ];

  return (
    <BackgroundDiv shouldCenter={false} className="flex h-screen flex-col">
      {/* Header with logo and join button */}
      <Header t={t} />

      {/* Main content split into two sections */}
      <div className="relative z-0 flex flex-1 flex-col">
        {/* Hero section - takes up at most half the screen height */}
        <div className="flex h-[50vh] max-h-[50vh] flex-col justify-center px-12">
          <div className="flex w-full flex-col">
            <HoverableContactTitle
              titleText={t("titleContact")}
              events={combinedEvents}
              contentId="subtitle-content"
            />
            <div className="w-fit self-end">
              <HoverableCreativesTitle>
                <Link href="/contacts">
                  <HeroTitle
                    className="text-hover-stroke-sunglow font-bold"
                    size="default"
                  >
                    {t("titleCreatives")}
                  </HeroTitle>
                </Link>
              </HoverableCreativesTitle>
            </div>
          </div>

          {/* Floating nav actions */}
          <ClientFloatingActions
            currentLang={lang}
            items={[
              { text: t("aboutCC"), href: "/about" },
              { text: t("contactBook"), href: "/contacts" },
              { text: t("event"), href: "/events" },
            ]}
            menuText={t("menu")}
          />
        </div>

        {/* Content section - fills the remaining space */}
        <div
          className="flex-1 space-y-10 overflow-y-auto px-12 pb-12"
          id="subtitle-content"
        >
          {/* Description text */}
          <Lead
            id="subtitle-content"
            className="text-foreground/90 mt-4 text-xl whitespace-pre-line md:text-2xl"
          >
            {t("subtitle")}
          </Lead>
          {/* Floating gradient background using ThumbnailImage component */}
          <ThumbnailImage
            width={320}
            height={180}
            interval={10000}
            className="absolute right-12 bottom-0 z-40"
          />
        </div>
      </div>

      {/* Event ticker at the bottom */}
      <footer className="relative z-50 w-full overflow-hidden text-black">
        {/* Social media links - positioned at bottom left above the footer */}
        <div className="mb-8 ml-12 flex w-fit flex-col gap-y-8 py-4">
          <a
            href="https://www.facebook.com/creativecontact.vn"
            className="text-foreground hover:text-sunglow transition-colors"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://instagram.com/creativecontact_vn"
            className="text-foreground hover:text-sunglow transition-colors"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://www.linkedin.com/company/creativecontact-vn"
            className="text-foreground hover:text-sunglow transition-colors"
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

// Source: https://github.com/vercel/next.js/issues/74128
// TODO: Attempt to remove now that we have Next 15.2
export const dynamic = "force-dynamic";
