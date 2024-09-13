import React, { useState } from 'react';

interface CreativeContactLogoProps {
  eventSlug: string;
  eventTitle: string;
  className?: string;
  width?: number;
  height?: number;
}

const CreativeContactLogo: React.FC<CreativeContactLogoProps> = ({ eventSlug,className, width = 200, height = 100, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = `${process.env.NEXT_PUBLIC_APP_URL}/${eventSlug}-event-logo.svg`;

  if (imageError) {
    return <h2 className='text-3xl font-bold text-primary-foreground' {...props}>Creative Contact</h2>;
  }

  return (
    <img 
      src={imageSrc}
      width={width}
      height={height}
      className={className}
      onError={() => setImageError(true)}
      alt={`${eventSlug} logo`}
      {...props}
    />
  );
};

export default CreativeContactLogo;