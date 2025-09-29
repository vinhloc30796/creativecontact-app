import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundDivProps {
  children: React.ReactNode;
  className?: string;
  eventSlug?: string;
  shouldCenter?: boolean;
  shouldImage?: boolean;
}

export function BackgroundDiv({ children, className, eventSlug, shouldCenter = true, shouldImage = false }: BackgroundDivProps) {
  const centerClass = shouldCenter ? 'flex items-center justify-center' : '';

  // Determine background style based on eventSlug and shouldImage combinations
  let backgroundStyle: React.CSSProperties = {};
  let backgroundClasses = '';

  if (eventSlug && shouldImage) {
    // Event-specific background image
    backgroundStyle = {
      backgroundImage: `url(/${eventSlug}-background.png)`,
      backgroundColor: 'hsla(var(--background), 0.6)'
    };
    // Vertical parallax by default (page scroll)
    backgroundClasses = 'bg-center bg-parallax-vertical';
  } else if (eventSlug && !shouldImage) {
    // Event-specific color (using CSS custom properties for theming)
    backgroundStyle = {
      backgroundColor: 'hsl(var(--background))'
    };
  } else if (!eventSlug && shouldImage) {
    // Generic background image
    backgroundStyle = {
      backgroundImage: 'url(/bg.jpg)',
      backgroundColor: 'hsla(var(--background), 0.6)'
    };
    backgroundClasses = 'bg-cover bg-center bg-no-repeat';
  } else {
    // Generic color (!eventSlug && !shouldImage)
    backgroundStyle = {
      backgroundColor: 'hsl(var(--background))'
    };
  }

  return (
    <div
      className={cn(
        "min-h-screen w-full",
        "min-h-[100vh]",
        backgroundClasses,
        centerClass,
        className
      )}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
}