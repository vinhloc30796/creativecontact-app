"use client";

import React, { useState, ReactNode, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { H4, Small } from "@/components/ui/typography";
import Link from "next/link";
import { HeroTitle } from "../ui/typography";

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
 */
export function HomepageEventOverlay({
  isVisible,
  className = "bg-none",
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
        <div className="flex flex-row h-full gap-24 px-4 py-6 overflow-x-auto">
          {events.map((event, index) => (
            <HomepageEventCard key={index} event={event} />
          ))}
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
  href?: string;
}

/**
 * HoverableContactTitle Component
 * 
 * A component that displays a title which, when hovered:
 * 1. Shows an overlay covering the content area
 * 2. Hides the element with the provided contentId or subtitle-content by default
 */
export function HoverableContactTitle({
  children,
  titleText,
  overlayClassName = "bg-none",
  events = [],
  contentRef,
  contentId = "subtitle-content",
  href = "/events"
}: HoverableContactTitleProps) {
  const [isHovering, setIsHovering] = useState(false);
  const autoDetectedRef = useRef<HTMLElement | null>(null);
  const effectiveRef = contentRef || autoDetectedRef;

  // Find element by ID if contentRef is not provided
  useEffect(() => {
    if (!contentRef) {
      const element = document.getElementById(contentId);
      if (element) {
        autoDetectedRef.current = element as HTMLElement;
      }
    }
  }, [contentRef, contentId]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    // Hide the content when hovering
    if (effectiveRef?.current) {
      effectiveRef.current.style.visibility = "hidden";
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Show the content when not hovering
    if (effectiveRef?.current) {
      effectiveRef.current.style.visibility = "visible";
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