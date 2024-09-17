import dynamic from 'next/dynamic';
import React from 'react';

interface EventLogoProps {
  eventSlug: string;
  eventTitle: string;
  className?: string;
  width?: number;
  height?: number;
}

const EventLogo: React.FC<EventLogoProps> = ({ eventSlug, eventTitle, className, width = 200, height = 100, ...props }) => {
  const EventLogoSVG = dynamic(() => import(`@/public/${eventSlug}-event-logo.svg`), {
    loading: () => <h2 className='text-2xl font-bold text-center text-primary' {...props}>{eventTitle}</h2>,
    ssr: false,
  });

  return (
    <EventLogoSVG 
      {...props} 
    />
  );
};

export default EventLogo;