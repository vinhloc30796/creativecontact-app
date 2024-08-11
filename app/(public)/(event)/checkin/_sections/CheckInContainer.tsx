// File: app/(public)/(event)/checkin/_sections/CheckInContainer.tsx
"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './_checkin.module.scss';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CheckInContainerProps {
  children: ReactNode;
}

export function CheckInContainer({ children }: CheckInContainerProps) {
  return (
    <div className={cn('min-h-screen flex items-center justify-center', styles.container)} style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover' }}>
      <Card className="w-[400px] overflow-hidden relative z-10">
        <CardHeader className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: 'url(/banner.jpg)',
            backgroundSize: 'cover',
          }}
        />
        <CardContent className='p-6 flex flex-col gap-2'>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}