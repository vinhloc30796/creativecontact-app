import { EventSlot } from "@/app/types/EventSlot";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { eventSlots } from "@/drizzle/schema/event";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import InConstruct from "@/components/InConstruction";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HeroTitle,
  Lead,
  P,
  Small
} from "@/components/ui/typography";
import { getServerTranslation } from "@/lib/i18n/init-server";

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
    <BackgroundDiv shouldCenter={false} className="flex flex-col h-screen">
      {/* Header with logo and join button */}
      <header className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="bg-yellow-400 rounded-full p-1 flex items-center justify-center h-12 w-12">
            <span className="text-black font-bold text-xl">CC</span>
          </Link>
        </div>

        <div className="flex items-center">
          <Button
            variant="link"
            asChild
            className="text-sm text-foreground hover:text-yellow-400"
          >
            <Link href="/join" className="flex items-center gap-1">
              {t("joinUs").split("of our network")[0]}
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                →
              </Badge>
              <span className="text-yellow-400">
                {lang === "en" ? "of our network" : "của mạng lưới chúng tôi"}
              </span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main content split into two sections */}
      <div className="flex flex-col flex-1 relative z-0">
        {/* Header section - takes up at most half the screen height */}
        <div className="h-[50vh] max-h-[50vh] flex flex-col justify-center px-12">
          <HeroTitle
            className="font-bold whitespace-pre-line"
            size="default"
          >
            {t("title")}
          </HeroTitle>

          {/* Translation and navigation row moved below title */}
          <div className="w-full flex justify-between items-center py-6">
            {/* Language switcher on left */}
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-2">
                      <Link
                        href="?lang=en"
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${lang === "en"
                          ? "bg-white text-black font-medium"
                          : "bg-white/10 text-foreground hover:bg-white/20"
                          }`}
                      >
                        EN
                      </Link>
                      <Link
                        href="?lang=vi"
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${lang === "vi"
                          ? "bg-white text-black font-medium"
                          : "bg-white/10 text-foreground hover:bg-white/20"
                          }`}
                      >
                        VI
                      </Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>{t("languageTooltip")}</P>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Navigation menu items on right */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                asChild
                className="bg-white/10 px-4 py-1.5 h-auto rounded-full text-sm text-foreground hover:bg-white/20 transition-colors"
              >
                <Link href="/about">
                  {t("aboutCC")}
                </Link>
              </Button>
              <Button
                asChild
                className="bg-yellow-400 px-4 py-1.5 h-auto rounded-full text-sm text-black font-medium hover:bg-yellow-500 transition-colors"
              >
                <Link href="/contacts">
                  {t("contactBook")}
                </Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="bg-white/10 px-4 py-1.5 h-auto rounded-full text-sm text-foreground hover:bg-white/20 transition-colors"
              >
                <Link href="/events">
                  {t("event")}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Content section - fills the remaining space */}
        <div className="flex-1 px-12 space-y-10 overflow-y-auto pb-12">
          {/* Description text */}
          <Lead className="text-foreground/90 whitespace-pre-line text-xl md:text-2xl">
            {t("subtitle")}
          </Lead>

          <Separator className="bg-white/10" />

          {/* Social media links */}
          <div>
            <Small className="text-foreground/70 mb-3 block">{t("followUs")}</Small>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 p-0 hover:bg-white/10">
                <a href="#" className="text-foreground hover:text-yellow-400 transition-colors">
                  <Facebook size={24} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 p-0 hover:bg-white/10">
                <a href="#" className="text-foreground hover:text-yellow-400 transition-colors">
                  <Instagram size={24} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 p-0 hover:bg-white/10">
                <a href="#" className="text-foreground hover:text-yellow-400 transition-colors">
                  <Linkedin size={24} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Event ticker at the bottom */}
      <footer className="w-full bg-yellow-400 text-black py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(4).fill(0).map((_, i) => (
            <span key={i} className="mx-4 text-base font-medium">{`${currentEvent} ${t("ticker")}`}</span>
          ))}
        </div>
      </footer>
    </BackgroundDiv>
  );
}
