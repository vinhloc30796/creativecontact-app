import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { format } from "date-fns";

import { fetchEvents } from "@/lib/payload/fetchEvents";
import { H1, H2, P, Lead } from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Events | Creative Contact",
  description:
    "Discover and join upcoming workshops, meetups, and creative events by Creative Contact.",
};

export default async function EventsPage() {
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
      <div className="container max-w-5xl py-16">
        <H1>Events</H1>
        <Lead className="mt-4">Stay tuned for upcoming events...</Lead>
        <P className="mt-8">
          We don&apos;t have any events scheduled at the moment. Check back soon
          or follow us on social media to be the first to know when new events
          are announced.
        </P>
      </div>
    );
  }

  // Group events by status: 'upcoming' first, then 'active', then 'past'
  const upcomingEvents = events.filter(
    (event: any) => event.status === "upcoming",
  );
  const activeEvents = events.filter((event: any) => event.status === "active");
  const pastEvents = events.filter((event: any) => event.status === "past");

  return (
    <div className="container max-w-5xl py-16">
      <H1>Events</H1>
      <Lead className="mt-4">
        Discover and join our creative workshops, meetups, and events.
      </Lead>

      {upcomingEvents.length > 0 && (
        <div className="mt-12">
          <H2>Upcoming Events</H2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {activeEvents.length > 0 && (
        <div className="mt-12">
          <H2>Happening Now</H2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="mt-12">
          <H2>Past Events</H2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
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
    <Card className="flex h-full flex-col overflow-hidden">
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
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <p className="text-muted-foreground">No image available</p>
          </div>
        )}
        <Badge
          className="absolute right-2 top-2"
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
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="mt-1 flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {formattedDate} {formattedTime && `at ${formattedTime}`}
          </span>
        </CardDescription>
        <CardDescription className="flex items-center gap-1.5">
          <MapPinIcon className="h-4 w-4" />
          <span>{event.location}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <P className="line-clamp-3 text-muted-foreground">{event.summary}</P>

        {event.tags && event.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="font-normal">
                {tag.tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/events/${event.slug}`}>
            View Event <ArrowRightIcon className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
