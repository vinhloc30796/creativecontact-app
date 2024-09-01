import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundDivProps {
  children: React.ReactNode;
  className?: string;
}

export function BackgroundDiv({ children, className }: BackgroundDivProps) {
  return (
    <div 
      className={cn("min-h-screen flex items-center justify-center", className)}
      style={{
        backgroundImage: 'url(/hoantat-2024-background-blur.png)',
        backgroundSize: 'cover',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      {children}
    </div>
  );
}