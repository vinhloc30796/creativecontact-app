import React from 'react';
import { Button as EmailButton } from "@react-email/components";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ href, children, className }) => {
  return (
    <EmailButton
      href={href}
      className={`bg-[#f27151] text-white px-4 py-2 font-medium ${className || ''}`}
    >
      {children}
    </EmailButton>
  );
};