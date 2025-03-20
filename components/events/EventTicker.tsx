"use client";

import React, { useRef, useEffect, useState } from "react";

interface EventTickerProps {
  eventName: string;
  tickerText: string;
  repetitions?: number;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
}

/**
 * EventTicker component displays a horizontally scrolling ticker with event information
 * 
 * @param eventName - The name of the current event
 * @param tickerText - Additional text to display after the event name
 * @param repetitions - Number of times to repeat the ticker text (default: 4)
 * @param speed - Animation speed in seconds (default: 20)
 * @param pauseOnHover - Whether to pause the animation on hover (default: true)
 * @param direction - Direction of the marquee (default: "left")
 */
export function EventTicker({
  eventName,
  tickerText,
  repetitions = 4,
  speed = 30,
  pauseOnHover = true,
  direction = "left",
}: EventTickerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  const fullText = `${eventName} ${tickerText}`;

  // Measure content width on mount and window resize
  useEffect(() => {
    const updateWidth = () => {
      if (contentRef.current) {
        setContentWidth(contentRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Create the animation style dynamically
  const getAnimationStyle = () => {
    // Base styles that apply in both states
    const baseStyles = {
      // Double the width to ensure content fills the space
      width: contentWidth > 0 ? `${contentWidth * 2}px` : 'auto',
      // This ensures the animation is smooth
      willChange: 'transform',
      // Individual animation properties
      animationName: `scroll-${direction}`,
      animationDuration: `${speed}s`,
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    };

    // Just update the play state when hovered, preserving position
    return {
      ...baseStyles,
      animationPlayState: isHovered && pauseOnHover ? 'paused' : 'running',
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-[2em] overflow-hidden bg-sunglow"
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        // Ensure container has no extra space
        width: '100%',
      }}
    >
      <div
        className="flex items-center"
        style={getAnimationStyle()}
      >
        {/* First copy of content */}
        <div ref={contentRef} className="flex whitespace-nowrap">
          {Array(repetitions)
            .fill(0)
            .map((_, i) => (
              <span
                key={`first-${i}`}
                className="mx-4 text-base font-medium"
              >
                {fullText}
              </span>
            ))}
        </div>

        {/* Second copy of content */}
        <div className="flex whitespace-nowrap">
          {Array(repetitions)
            .fill(0)
            .map((_, i) => (
              <span
                key={`second-${i}`}
                className="mx-4 text-base font-medium"
              >
                {fullText}
              </span>
            ))}
        </div>
      </div>

      {/* CSS for the animation */}
      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
} 