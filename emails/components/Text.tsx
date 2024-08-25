import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Text: React.FC<TextProps> = ({ children, className }) => {
  return (
    <p className={`text-text mb-4 ${className || ''}`}>
      {children}
    </p>
  );
};

export const Heading: React.FC<TextProps> = ({ children, className }) => {
  return (
    <h1 className={`text-2xl font-bold text-primary mb-6 ${className || ''}`}>
      {children}
    </h1>
  );
};