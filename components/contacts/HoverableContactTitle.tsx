"use client";

import React, { useState, ReactNode, useRef, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { H4, Small } from "@/components/ui/typography";
import Link from "next/link";
import { HeroTitle } from "../ui/typography";

/**
 * Add Tailwind animation for auto-scrolling events from right to left
 *
 * Added to tailwind.config.ts:
 * - Under theme.extend.animation: 'scroll-x': 'scrollX 30s linear infinite'
 * - Under theme.extend.keyframes: scrollX with translateX(0) to translateX(-100%)
 */

/**
 * Event interface for the HomepageEventOverlay component
 */
export interface EventItem {
  title: string;
  datetime: Date;
  [key: string]: any; // allow extra fields for real data
}

/**
 * Interface for image placeholder metadata
 */
export interface EventImagePlaceholderMetadata {
  width: number;
  height: number;
  url?: string;
}

/**
 * Generates random dimensions for image placeholders
 *
 * @param count Number of image placeholders to generate
 * @returns Array of image placeholder metadata
 */
export function getRandomImagePlaceholders(
  count: number = 3,
): EventImagePlaceholderMetadata[] {
  // Always use the specified count, no randomization
  return Array.from({ length: count }, () => ({
    // Random width & height between 200-280px
    width: Math.floor(Math.random() * 80) + 200,
    height: Math.floor(Math.random() * 80) + 200,
    url:
      Math.random() > 0.5
        ? `https://example.com/image/${Math.random().toString(36).substring(2, 8)}`
        : undefined,
  }));
}

/**
 * ImagePlaceholder Component
 *
 * A component that displays an image placeholder with random dimensions.
 */
export function EventImagePlaceholder({
  width,
  height,
  url,
  className,
}: EventImagePlaceholderMetadata & { className?: string }) {
  return (
    <Card
      className={cn("shrink-0 overflow-hidden", className)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <CardHeader className="bg-sunglow shrink-0 p-2">
        <CardTitle className="text-sm">[IN CONSTRUCTION]</CardTitle>
      </CardHeader>
      <CardContent className="grow bg-gray-100 p-0">
        {/* Empty content area representing an image placeholder */}
      </CardContent>
      <CardFooter className="shrink-0 p-2">
        <button
          onClick={() => url && window.open(url, "_blank")}
          className="cursor-pointer text-xs text-blue-500 hover:underline"
        >
          View details
        </button>
      </CardFooter>
    </Card>
  );
}

/**
 * EventImage Component
 *
 * A component that displays a real image.
 */
export function EventImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Card
      className={cn("shrink-0 overflow-hidden", className)}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {/* wrapper for Next.js Image fill */}
      <div className="relative h-full w-full">
        <Image src={src} alt={alt || ""} fill className="object-cover" />
      </div>
    </Card>
  );
}

// Unified image type for HomepageEventCard
interface PlaceholderItem {
  isPlaceholder: true;
  width: number;
  height: number;
  url?: string;
}
interface RealImageItem {
  isPlaceholder: false;
  src: string;
  alt?: string;
}
type ImageToShow = PlaceholderItem | RealImageItem;

/**
 * AnnualEventTextCard Component
 *
 * A component that displays annual event information including year and event count.
 */
export function AnnualEventTextCard({
  year,
  eventCount,
}: {
  year: string | number;
  eventCount: number;
}) {
  return (
    <div className="mt-0 min-w-48 shrink-0 pt-0">
      <div className="grow">
        <H4 className="text-5xl font-bold">{year}</H4>
      </div>
      <div className="mt-auto pt-0">
        <Small className="text-gray-500">
          {eventCount} {eventCount === 1 ? "event" : "events"}
        </Small>
      </div>
    </div>
  );
}

/**
 * HomepageEventCard Component
 *
 * A component that displays an event with text and image placeholders as separate cards
 * at the same level within a div container.
 *
 * @example
 * <HomepageEventCard
 *   year="2023"
 *   events={[]}
 * />
 */
export function HomepageEventCard({
  year,
  events,
}: {
  year: string | number;
  events: EventItem[];
}): React.JSX.Element {
  const nRealEvents = events.filter(
    (evt) => evt.isPlaceholder === false,
  ).length;
  const nMockEvents = events.length - nRealEvents;
  console.log(
    "[HomepageEventCard] received {} events, of which: {} real events, {} mock events",
    events.length,
    nRealEvents,
    nMockEvents,
  );
  console.log("[HomepageEventCard] events: {}", events);
  // Build typed image list
  const eventCount = events.length;
  const imagesToShow: ImageToShow[] = events.map((evt) => {
    if (evt.isPlaceholder) {
      return {
        isPlaceholder: true,
        width: evt.width,
        height: evt.height,
        url: evt.url,
      };
    }
    if (evt.featuredImage?.url) {
      return {
        isPlaceholder: false,
        src: evt.featuredImage.url,
        alt: evt.featuredImage.alt || evt.title,
      };
    }
    const p = getRandomImagePlaceholders(1)[0];
    return {
      isPlaceholder: true,
      width: p.width,
      height: p.height,
      url: p.url,
    };
  });

  return (
    <Card className="flex h-full w-fit flex-row gap-4 border-none bg-transparent p-4 shadow-none">
      <AnnualEventTextCard year={year} eventCount={eventCount} />
      {imagesToShow.map((img, index) => {
        if (img.isPlaceholder) {
          return (
            <EventImagePlaceholder
              key={index}
              width={img.width}
              height={img.height}
              url={img.url}
            />
          );
        }
        return (
          <EventImage
            key={index}
            src={img.src}
            alt={img.alt}
            width={200}
            height={200}
          />
        );
      })}
    </Card>
  );
}

/**
 * HomepageEventOverlay Component
 *
 * A component that displays a blank overlay covering the content section of the homepage,
 * with a horizontal list of events if provided.
 */
export function HomepageEventOverlay({
  isVisible,
  className = "bg-none",
  events = [],
}: {
  isVisible: boolean;
  className?: string;
  events?: EventItem[];
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Normalize events to handle both mock and real data
  const normalizedEvents: EventItem[] = events.map((evt) => ({
    ...evt,
    datetime:
      evt.datetime ?? (evt.eventDate ? new Date(evt.eventDate) : new Date()),
  }));

  if (!isVisible) return null;

  // Group events by year
  const eventsByYear = normalizedEvents.reduce<Record<string, EventItem[]>>(
    (acc, event) => {
      // Extract year from Date object
      const year = event.datetime.getFullYear().toString();

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(event);
      return acc;
    },
    {},
  );

  // Convert grouped events to array for rendering
  const yearGroups = Object.entries(eventsByYear)
    .sort((a, b) => b[0].localeCompare(a[0])) // Sort by year descending
    .map(([year, yearEvents]) => ({
      year,
      eventCount: yearEvents.length,
      events: yearEvents,
    }));

  return (
    <div
      ref={overlayRef}
      className={`animate-fadeIn fixed z-10 px-20 ${className}`}
      style={{
        // Position to cover from content start to ticker
        top: "55vh",
        bottom: "0", // Extend all the way to the bottom of the viewport
        left: "0",
        right: "0",
        // Ensure it's displayed over content but under social icons
        zIndex: 40,
      }}
    >
      {normalizedEvents.length > 0 && (
        <div className="w-full">
          <div className="animate-scroll-x flex h-full flex-row gap-24 px-4 py-6 whitespace-nowrap">
            {yearGroups.map((yearGroup, index) => (
              <HomepageEventCard
                key={index}
                year={yearGroup.year}
                events={yearGroup.events}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface HoverableContactTitleProps {
  children?: ReactNode;
  titleText?: string;
  overlayClassName?: string;
  events?: EventItem[];
  contentRef?: React.RefObject<HTMLElement | null>;
  contentId?: string;
  backgroundId?: string;
  href?: string;
}

/**
 * HoverableContactTitle Component
 *
 * A component that displays a title which, when hovered:
 * 1. Shows an overlay covering the content area
 * 2. Hides the element with the provided contentId or subtitle-content by default
 * 3. Hides the background element if backgroundId is provided
 */
export function HoverableContactTitle({
  children,
  titleText,
  overlayClassName = "bg-none",
  events = [],
  contentRef,
  contentId = "subtitle-content",
  backgroundId = "floating-gradient-background",
  href = "/events",
}: HoverableContactTitleProps) {
  const [isHovering, setIsHovering] = useState(false);
  const autoDetectedRef = useRef<HTMLElement | null>(null);
  const backgroundRef = useRef<HTMLElement | null>(null);
  const effectiveRef = contentRef || autoDetectedRef;

  // Find elements by ID if refs are not provided
  useEffect(() => {
    if (!contentRef) {
      const element = document.getElementById(contentId);
      if (element) {
        autoDetectedRef.current = element as HTMLElement;
      }
    }

    // Find background element
    const bgElement = document.getElementById(backgroundId);
    if (bgElement) {
      backgroundRef.current = bgElement as HTMLElement;
    }
  }, [contentRef, contentId, backgroundId]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    // Hide the content when hovering
    if (effectiveRef?.current) {
      effectiveRef.current.style.visibility = "hidden";
    }
    // Hide the background when hovering
    if (backgroundRef?.current) {
      backgroundRef.current.style.visibility = "hidden";
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Show the content when not hovering
    if (effectiveRef?.current) {
      effectiveRef.current.style.visibility = "visible";
    }
    // Show the background when not hovering
    if (backgroundRef?.current) {
      backgroundRef.current.style.visibility = "visible";
    }
  };

  // If titleText is provided, render with Link, otherwise use children
  const content = titleText ? (
    <Link href={href} className="w-fit self-start">
      <div
        className="w-fit"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <HeroTitle
          className="text-hover-stroke-sunglow font-bold"
          size="default"
        >
          {titleText}
        </HeroTitle>
      </div>
    </Link>
  ) : (
    <div
      className="w-fit"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );

  return (
    <div className="relative">
      {content}

      <HomepageEventOverlay
        isVisible={isHovering}
        className={overlayClassName}
        events={events}
      />
    </div>
  );
}
