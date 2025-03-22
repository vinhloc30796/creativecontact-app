"use client";

import React, { useState, ReactNode, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
export function getRandomImagePlaceholders(count: number = 3): EventImagePlaceholderMetadata[] {
  // Always use the specified count, no randomization
  return Array.from({ length: count }, () => ({
    // Random width & height between 200-280px
    width: Math.floor(Math.random() * 80) + 200,
    height: Math.floor(Math.random() * 80) + 200,
    url: Math.random() > 0.5
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
      <CardHeader className="shrink-0 bg-sunglow p-2">
        <CardTitle className="text-sm">[IN CONSTRUCTION]</CardTitle>
      </CardHeader>
      <CardContent className="grow bg-gray-100 p-0">
        {/* Empty content area representing an image placeholder */}
      </CardContent>
      <CardFooter className="shrink-0 p-2">
        <button
          onClick={() => url && window.open(url, '_blank')}
          className="text-xs text-blue-500 hover:underline cursor-pointer"
        >
          View details
        </button>
      </CardFooter>
    </Card>
  );
}

/**
 * AnnualEventTextCard Component
 * 
 * A component that displays annual event information including year and event count.
 */
export function AnnualEventTextCard({ year, eventCount }: { year: string | number, eventCount: number }) {
  return (
    <div className="shrink-0 min-w-48 pt-0 mt-0">
      <div className="grow">
        <H4 className="text-5xl font-bold">{year}</H4>
      </div>
      <div className="pt-0 mt-auto">
        <Small className="text-gray-500">
          {eventCount} {eventCount === 1 ? 'event' : 'events'}
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
 *   eventCount={5}
 * />
 */
export function HomepageEventCard({
  year,
  eventCount,
  event
}: {
  year: string | number,
  eventCount: number,
  event?: EventItem  // Optional event item for displaying additional details
}) {
  // Generate exactly eventCount image placeholders
  const imagePlaceholders = getRandomImagePlaceholders(eventCount);

  return (
    <Card className="flex flex-row gap-4 h-full w-fit p-4 bg-transparent border-none shadow-none">
      {/* Annual Event Text Card */}
      <AnnualEventTextCard year={year} eventCount={eventCount} />

      {/* Image placeholder cards */}
      {imagePlaceholders.map((placeholder, index) => (
        <EventImagePlaceholder
          key={index}
          width={placeholder.width}
          height={placeholder.height}
          url={placeholder.url}
        />
      ))}
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

  if (!isVisible) return null;

  // Group events by year
  const eventsByYear = events.reduce<Record<string, EventItem[]>>((acc, event) => {
    // Extract year from Date object
    const year = event.datetime.getFullYear().toString();

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push(event);
    return acc;
  }, {});

  // Convert grouped events to array for rendering
  const yearGroups = Object.entries(eventsByYear)
    .sort((a, b) => b[0].localeCompare(a[0])) // Sort by year descending
    .map(([year, yearEvents]) => ({
      year,
      eventCount: yearEvents.length,
    }));

  return (
    <div
      ref={overlayRef}
      className={`fixed z-10 px-20 animate-fadeIn ${className}`}
      style={{
        // Position to cover from content start to ticker
        top: "55vh",
        bottom: "0", // Extend all the way to the bottom of the viewport
        left: "0",
        right: "0",
        // Ensure it's displayed over content but under social icons
        zIndex: 40
      }}
    >
      {events.length > 0 && (
        <div className="w-full">
          <div className="flex flex-row h-full gap-24 px-4 py-6 animate-scroll-x whitespace-nowrap">
            {yearGroups.map((yearGroup, index) => (
              <HomepageEventCard
                key={index}
                year={yearGroup.year}
                eventCount={yearGroup.eventCount}
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
  href = "/events"
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
        <HeroTitle className="text-hover-border font-bold" size="default">
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