"use client";

import React, { useState, ReactNode, useRef } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

/**
 * Event interface for the HomepageEventOverlay component
 */
export interface EventItem {
  title: string;
  datetime: Date | string;
}

/**
 * HomepageEventCard Component
 * 
 * A component that displays an event card with title and datetime.
 * 
 * @example
 * <HomepageEventCard 
 *   event={{ title: "Workshop", datetime: new Date() }}
 * />
 */
export function HomepageEventCard({ event }: { event: EventItem }) {
  return (
    <Card className="h-full min-w-48 flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="text-lg">{event.title}</CardTitle>
      </CardHeader>
      <CardFooter className="pt-0 mt-auto">
        <p className="text-sm text-muted-foreground">
          {typeof event.datetime === 'string'
            ? event.datetime
            : format(event.datetime, 'MMM dd, yyyy • HH:mm')}
        </p>
      </CardFooter>
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
 *   className="bg-black/50"
 *   events={[{ title: "Workshop", datetime: new Date() }]} 
 * />
 */
export function HomepageEventOverlay({
  isVisible,
  className = "bg-black/50",
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