"use client";

import React, { useState, ReactNode, useRef } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { H4, Small } from "@/components/ui/typography";

/**
 * Event interface for the HomepageEventOverlay component
 */
export interface EventItem {
  title: string;
  datetime: Date | string;
}

/**
 * Interface for image placeholder metadata
 */
export interface ImagePlaceholderMetadata {
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
export function getRandomImagePlaceholders(count: number = 3): ImagePlaceholderMetadata[] {
  // Generate a list of random dimensions for image placeholders
  // Random count between 2-5 if not specified
  const actualCount = count || Math.floor(Math.random() * 4) + 2;

  return Array.from({ length: actualCount }, () => ({
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
export function ImagePlaceholder({
  width,
  height,
  url,
  className,
}: ImagePlaceholderMetadata & { className?: string }) {
  return (
    <Card
      className={cn("flex-shrink-0 overflow-hidden", className)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <CardHeader className="flex-shrink-0 bg-yellow-400 p-2">
        <CardTitle className="text-sm">[IN CONSTRUCTION]</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow bg-gray-100 p-0">
        {/* Empty content area representing an image placeholder */}
      </CardContent>
      <CardFooter className="flex-shrink-0 p-2">
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
 * CardText Component
 * 
 * A component that displays the event title and datetime in a card.
 */
export function EventTextCard({ event }: { event: EventItem }) {
  return (
    <div className="flex-shrink-0 min-w-48 pt-0 mt-0">
      <div className="flex-grow">
        <H4>{event.title}</H4>
      </div>
      <div className="pt-0 mt-auto">
        <Small>
          {typeof event.datetime === 'string'
            ? event.datetime
            : format(event.datetime, 'MMM dd, yyyy • HH:mm')}
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
 *   event={{ title: "Workshop", datetime: new Date() }}
 * />
 */
export function HomepageEventCard({ event }: { event: EventItem }) {
  // Generate 2-5 random image placeholders
  const randomCount = Math.floor(Math.random() * 4) + 2;
  const imagePlaceholders = getRandomImagePlaceholders(randomCount);

  return (
    <Card className="flex flex-row gap-4 h-full w-fit p-4 bg-transparent border-none shadow-none">
      {/* Text Card */}
      <EventTextCard event={event} />

      {/* Image placeholder cards */}
      {imagePlaceholders.map((placeholder, index) => (
        <ImagePlaceholder
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
 * 
 * @example
 * <HomepageEventOverlay 
 *   isVisible={true} 
 *   className="bg-transparent"
 *   events={[{ title: "Workshop", datetime: new Date() }]} 
 * />
 */
export function HomepageEventOverlay({
  isVisible,
  className = "bg-black/10",
  // className = "bg-transparent",
  events = []
}: {
  isVisible: boolean;
  className?: string;
  events?: EventItem[];
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      // mb-[2em] is to account for the footer height
      className={`fixed inset-0 px-20 z-10 pointer-events-none animate-fadeIn mb-[2em] ${className} overflow-x-hidden`}
      style={{
        // Position the overlay to cover only the content section
        // It will start below the header section and end before the footer
        top: "55vh", // Start from the middle of the viewport (where content section begins)
        bottom: "0",
        left: "0",
        right: "0"
      }}
    >
      {events.length > 0 && (
        <div className="flex flex-row h-full gap-24 px-4 py-6">
          {events.map((event, index) => (
            <HomepageEventCard key={index} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

interface HoverableContactTitleProps {
  children: ReactNode;
  overlayClassName?: string;
  events?: EventItem[];
}

/**
 * HoverableContactTitle Component
 * 
 * A component that displays a title which, when hovered, shows a blank overlay
 * that covers the content section of the page. Can optionally display a list of events.
 * 
 * @example
 * <HoverableContactTitle events={[{ title: "Workshop", datetime: new Date() }]}>
 *   <h2>Contact Title</h2>
 * </HoverableContactTitle>
 */
export function HoverableContactTitle({
  children,
  overlayClassName = "bg-black/50", // Default semi-transparent black overlay
  // overlayClassName = "bg-transparent", // Default transparent overlay
  events = []
}: HoverableContactTitleProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="relative">
      <div
        className="w-fit"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      <HomepageEventOverlay
        isVisible={isHovering}
        className={overlayClassName}
        events={events}
      />
    </div>
  );
} 