import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundDivProps {
  children: React.ReactNode;
  className?: string;
  eventSlug?: string;
}

export function BackgroundDiv({ children, className, eventSlug = 'hoantat-2024' }: BackgroundDivProps) {
  const backgroundImage = `/${eventSlug}-background-blur.png`;
  console.debug(`Background image: ${backgroundImage}`);

  return (
    <div 
      className={cn("min-h-screen flex items-center justify-center", className)}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      {children}
    </div>
  );
}