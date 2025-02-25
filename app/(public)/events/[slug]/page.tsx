import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { format } from "date-fns";
import Link from "next/link";

import { fetchEventBySlug } from "@/lib/payload/fetchEvents";
import { H1, H2, P, Lead } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  CheckCircleIcon,
} from "@/components/ui/icons";
import { RenderBlocks } from "@/components/payload-cms/RenderBlocks";
import { BlockTypes, getMediaUrl } from "@/lib/payload/payloadTypeAdapter";

// Dynamic metadata based on event
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }

  const mediaUrl = getMediaUrl(event.featuredImage);

  return {
    title: `${event.title} | Creative Contact Events`,
    description: event.summary || "Creative Contact Event",
    openGraph: mediaUrl
      ? {
          images: [{ url: mediaUrl }],
        }
      : undefined,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event) {
    return notFound();
  }

  const eventDate = event.eventDate ? new Date(event.eventDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const formattedDate = eventDate
    ? format(eventDate, "EEEE, MMMM d, yyyy")
    : "Date to be determined";

  const formattedTime = eventDate ? format(eventDate, "h:mm a") : "";

  const formattedEndTime = endDate ? format(endDate, "h:mm a") : "";

  // Format duration if both start and end times are available
  let duration = "";
  if (eventDate && endDate) {
    if (endDate.toDateString() === eventDate.toDateString()) {
      // Same day event
      duration = `${formattedTime} - ${formattedEndTime}`;
    } else {
      // Multi-day event
      duration = `${format(eventDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
    }
  } else if (eventDate) {
    duration = formattedTime;
  }

  return (
    <main className="min-h-screen">
      {/* Hero section with featured image */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        {event.featuredImage ? (
          <Image
            src={getMediaUrl(event.featuredImage)}
            alt={
              (typeof event.featuredImage === "object" &&
                event.featuredImage.alt) ||
              event.title
            }
            fill
            className="object-cover"
            priority
            quality={90}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <p className="text-muted-foreground">No featured image available</p>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-end bg-black/40">
          <div className="container max-w-5xl pb-12">
            <Badge
              variant={
                event.status === "upcoming"
                  ? "default"
                  : event.status === "active"
                    ? "success"
                    : "outline"
              }
              className="mb-4"
            >
              {event.status === "upcoming"
                ? "Upcoming"
                : event.status === "active"
                  ? "Happening now"
                  : "Past event"}
            </Badge>
            <H1 className="mb-4 text-white">{event.title}</H1>
            <div className="flex flex-col gap-4 text-white sm:flex-row sm:gap-8">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{formattedDate}</span>
              </div>
              {duration && (
                <div className="flex items-center gap-2">
                  <span>{duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5" />
                  <span>Capacity: {event.capacity}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container max-w-5xl py-12">
        {/* Summary */}
        <div className="mb-12">
          <Lead>{event.summary}</Lead>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag.tag || ""}
              </Badge>
            ))}
          </div>
        )}

        {/* Registration button */}
        {event.registrationRequired && event.status !== "past" && (
          <div className="mb-12 flex flex-col items-center justify-between gap-4 rounded-lg bg-muted p-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-primary" />
              <div>
                <P className="font-medium">Registration required</P>
                <P className="text-muted-foreground">
                  Secure your spot for this event
                </P>
              </div>
            </div>

            {event.registrationLink ? (
              <Button size="lg" asChild>
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now
                </a>
              </Button>
            ) : (
              <Button size="lg">Contact for Registration</Button>
            )}
          </div>
        )}

        {/* Blocks Content */}
        {event.content && event.content.length > 0 && (
          <div className="prose prose-lg max-w-none">
            <RenderBlocks blocks={event.content as unknown as BlockTypes[]} />
          </div>
        )}

        {/* Back to events link */}
        <div className="mt-16 border-t pt-8">
          <Button variant="outline" asChild>
            <Link href="/events">← Back to all events</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
