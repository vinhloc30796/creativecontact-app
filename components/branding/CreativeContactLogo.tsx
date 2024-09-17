import React from 'react';
import LogoSVG from '@/public/logo-horizontal-transparent.svg';

interface CreativeContactLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number;
  height?: number;
}

const CreativeContactLogo: React.FC<CreativeContactLogoProps> = ({ 
  className, 
  width = 200, 
  height = 100, 
  ...props 
}) => {
  return (
    <LogoSVG 
      className={className}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default CreativeContactLogo;