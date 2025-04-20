import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ClientNavMenu } from "@/components/ClientNavMenu";
import { TextIconBox } from "@/components/text-icon-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
} from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { H2, HeroTitle, Lead, P } from "@/components/ui/typography";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { fetchEvents } from "@/lib/payload/fetchEvents";
import { Header } from "@/components/Header";
import { FooterCTA } from "@/components/FooterCTA";
import EventSwimLane from "@/components/events/EventSwimLane";

export const metadata: Metadata = {
  title: "Events | Creative Contact",
  description:
    "Discover and join upcoming workshops, meetups, and creative events by Creative Contact.",
};

export default async function EventsPage() {
  const { t } = await getServerTranslation("en", "HomePage");

  const events = await fetchEvents({
    sort: "eventDate",
    where: {
      status: {
        not_equals: "draft",
      },
    },
  });

  if (!events || events.length === 0) {
    return (
      <BackgroundDiv shouldCenter={false} className="flex h-screen flex-col">
        <Header t={t} />

        {/* Main content */}
        <div className="relative z-0 flex flex-1 flex-col">
          {/* Header section */}
          <div className="flex h-[30vh] max-h-[30vh] flex-col justify-center px-12">
            <HeroTitle className="font-bold whitespace-pre-line" size="medium">
              Events
            </HeroTitle>

            {/* Navigation row */}
            <div className="flex w-full items-center justify-end py-6">
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

          {/* Content section */}
          <div className="flex-1 space-y-10 overflow-y-auto px-12 pb-12">
            <Lead className="text-foreground/90 text-xl whitespace-pre-line md:text-2xl">
              Stay tuned for upcoming events...
            </Lead>
            <Separator className="bg-white/10" />
            <P className="mt-8">
              We don&apos;t have any events scheduled at the moment. Check back
              soon or follow us on social media to be the first to know when new
              events are announced.
            </P>
          </div>
        </div>
        <FooterCTA />
      </BackgroundDiv>
    );
  }

  return (
    <BackgroundDiv shouldCenter={false} className="flex min-h-screen flex-col">
      {/* Header with logo and join button */}
      <Header t={t} />

      {/* Main content */}
      <div className="relative z-0 flex flex-1 flex-col">
        {/* Header section */}
        <div className="flex h-[30vh] max-h-[30vh] flex-col justify-center px-12">
          <HeroTitle className="font-bold whitespace-pre-line" size="medium">
            Events
          </HeroTitle>

          {/* Navigation row */}
          <div className="flex w-full items-center justify-end py-6">
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
        {/* Content section */}
        <div className="flex-1 space-y-10 overflow-y-auto px-12 pb-12">
          <Lead className="text-foreground/90 text-xl whitespace-pre-line md:text-2xl">
            Discover and join our creative workshops, meetups, and events.
          </Lead>

          <Separator className="bg-white/10" />

          <H2 className="text-foreground/90">Creative Events</H2>
          {/* Swim Lane Grid for Events */}
          <div className="mt-12">
            {events.map((event: any, rowIndex: number) => (
              <EventSwimLane
                rowIndex={rowIndex}
                key={event.id}
                eventId={event.id}
                thumbnailUrl={(event.featuredImage as any).url || ""}
                title={event.title}
                date={event.eventDate}
                attendeeCount={event.capacity || 0}
                type={event.tags?.[0]?.tag || ""}
                slug={event.slug}
              />
            ))}
          </div>
        </div>
        s
      </div>

      <FooterCTA />
    </BackgroundDiv>
  );
}

// Type declarations for event data
interface EventImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  eventDate: string;
  endDate?: string;
  location: string;
  status: "draft" | "upcoming" | "active" | "past";
  featuredImage: EventImage;
  tags?: { tag: string }[];
  registrationRequired?: boolean;
  registrationLink?: string;
}

function EventCard({ event }: { event: Event }) {
  // Format date: "FEB 24, 2024" for display
  const formattedDate = event.eventDate
    ? format(new Date(event.eventDate), "MMM d, yyyy")
    : "Date TBD";

  // Format time for display if available
  const formattedTime = event.eventDate
    ? format(new Date(event.eventDate), "h:mm a")
    : "";

  return (
    <Card className="flex h-full flex-col overflow-hidden border-0 bg-white/10 backdrop-blur-xs transition-all hover:bg-white/15">
      <div className="relative h-48 w-full">
        {event.featuredImage?.url ? (
          <Image
            src={event.featuredImage.url}
            alt={event.featuredImage.alt || event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">No image available</p>
          </div>
        )}
        <Badge
          className="absolute top-2 right-2"
          variant={
            event.status === "upcoming"
              ? "default"
              : event.status === "active"
                ? "success"
                : "outline"
          }
        >
          {event.status === "upcoming"
            ? "Upcoming"
            : event.status === "active"
              ? "Happening now"
              : "Past event"}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-foreground line-clamp-2">
          {event.title}
        </CardTitle>
        <CardDescription className="text-foreground/70 mt-1 flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {formattedDate} {formattedTime && `at ${formattedTime}`}
          </span>
        </CardDescription>
        <CardDescription className="text-foreground/70 flex items-center gap-1.5">
          <MapPinIcon className="h-4 w-4" />
          <span>{event.location}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <P className="text-foreground/80 line-clamp-3">{event.summary}</P>

        {event.tags && event.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {event.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-foreground bg-white/10 font-normal hover:bg-white/20"
              >
                {tag.tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          className="bg-sunglow w-full text-black hover:bg-yellow-500"
        >
          <Link href={`/events/${event.slug}`}>
            View Event <ArrowRightIcon className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
