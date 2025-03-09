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
    <BackgroundDiv shouldCenter={false} className="flex flex-col">
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

      {/* Main content */}
      <main className="flex-1 px-4 md:px-6 py-12 w-full max-w-[1400px] mx-auto">
        <Card className="w-full mx-auto bg-transparent border-none shadow-none">
          <CardHeader className="px-0 pt-0 w-full">
            <HeroTitle
              className="font-bold whitespace-pre-line"
              size="default"
            >
              {t("title")}
            </HeroTitle>
          </CardHeader>

          <CardContent className="px-0 space-y-10">
            {/* Language switcher */}
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-2">
                      <Link
                        href="?lang=en"
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${lang === "en"
                          ? "bg-white text-black font-medium"
                          : "bg-white/10 text-foreground hover:bg-white/20"
                          }`}
                      >
                        EN
                      </Link>
                      <Link
                        href="?lang=vi"
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${lang === "vi"
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

            {/* Navigation buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="ghost"
                asChild
                className="bg-white/10 px-6 py-6 h-auto rounded-full text-sm text-foreground hover:bg-white/20 transition-colors"
                size="lg"
              >
                <Link href="/about">
                  {t("aboutCC")}
                </Link>
              </Button>
              <Button
                asChild
                className="bg-yellow-400 px-6 py-6 h-auto rounded-full text-sm text-black font-medium hover:bg-yellow-500 transition-colors"
                size="lg"
              >
                <Link href="/contacts">
                  {t("contactBook")}
                </Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="bg-white/10 px-6 py-6 h-auto rounded-full text-sm text-foreground hover:bg-white/20 transition-colors"
                size="lg"
              >
                <Link href="/events">
                  {t("event")}
                </Link>
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="bg-white/10 px-6 py-6 h-auto rounded-full text-sm text-foreground hover:bg-white/20 transition-colors"
                          size="lg"
                        >
                          {t("menu")}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black/80 border-white/20 text-foreground">
                        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                          <Link href="/about" className="w-full">
                            {t("aboutCC")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                          <Link href="/contacts" className="w-full">
                            {t("contactBook")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                          <Link href="/events" className="w-full">
                            {t("event")}
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>{t("menuTooltip")}</P>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

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
          </CardContent>
        </Card>
      </main>

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
