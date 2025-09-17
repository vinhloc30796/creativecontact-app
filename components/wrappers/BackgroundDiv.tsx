import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundDivProps {
  children: React.ReactNode;
  className?: string;
  eventSlug?: string;
  shouldCenter?: boolean;
}

export function BackgroundDiv({ children, className, eventSlug, shouldCenter = true }: BackgroundDivProps) {
  const centerClass = shouldCenter ? 'flex items-center justify-center' : '';

  // Style based on whether eventSlug is provided
  const backgroundStyle = eventSlug
    ? {
      backgroundImage: `url(/${eventSlug}-background-blur.png), url(/bg.jpg)`,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
    : {
      backgroundColor: '#FCFAF5'
    };

  return (
    <div
      className={cn(
        "min-h-screen w-full",
        "min-h-[100vh]",
        eventSlug ? "bg-cover bg-center bg-no-repeat bg-parallax" : "",
        centerClass,
        className
      )}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
}