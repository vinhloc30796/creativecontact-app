"use client";

import React, { useState, ReactNode, useRef } from "react";

/**
 * HomepageEventOverlay Component
 * 
 * A component that displays a blank overlay covering the content section of the homepage.
 * 
 * @example
 * <HomepageEventOverlay isVisible={true} className="bg-black/50" />
 */
export function HomepageEventOverlay({
  isVisible,
  className = "bg-black/50"
}: {
  isVisible: boolean;
  className?: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-10 pointer-events-none animate-fadeIn ${className}`}
      style={{
        // Position the overlay to cover only the content section
        // It will start below the header section and end before the footer
        top: "55vh", // Start from the middle of the viewport (where content section begins)
        bottom: "0",
        left: "0",
        right: "0"
      }}
    />
  );
}

interface HoverableContactTitleProps {
  children: ReactNode;
  overlayClassName?: string;
}

/**
 * HoverableContactTitle Component
 * 
 * A component that displays a title which, when hovered, shows a blank overlay
 * that covers the content section of the page.
 * 
 * @example
 * <HoverableContactTitle>
 *   <h2>Contact Title</h2>
 * </HoverableContactTitle>
 */
export function HoverableContactTitle({
  children,
  overlayClassName = "bg-black/50" // Default semi-transparent black overlay
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

      <HomepageEventOverlay isVisible={isHovering} className={overlayClassName} />
    </div>
  );
} 