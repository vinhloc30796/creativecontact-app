import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundDivProps {
  children: React.ReactNode;
  className?: string;
  eventSlug?: string;
  shouldCenter?: boolean;
}

export function BackgroundDiv({ children, className, eventSlug = 'hoantat-2024', shouldCenter = true }: BackgroundDivProps) {
  const backgroundImage = `/${eventSlug}-background-blur.png`;
  const fallbackImage = '/bg.jpg';
  const centerClass = shouldCenter ? 'flex items-center justify-center' : '';
  return (
    <div 
      className={cn("min-h-screen", centerClass, className)}
      style={{
        backgroundImage: `url(${backgroundImage}), url(${fallbackImage})`,
        backgroundSize: 'cover',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      {children}
    </div>
  );
}