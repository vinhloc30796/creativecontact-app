'use client';

import { useEffect, useState, useRef } from 'react';

interface ThumbnailImageProps {
  width?: number;
  height?: number;
  interval?: number;
  className?: string;
}

const getNextThumbnailUrl = (width: number, height: number) => {
  // Use a random seed for picsum to get different images
  const randomSeed = Math.floor(Math.random() * 1000);
  const timestamp = new Date().getTime(); // Prevent caching
  return `https://picsum.photos/seed/${randomSeed}/${width}/${height}?t=${timestamp}`;
};

export function ThumbnailImage({
  width = 320,
  height = 180,
  interval = 5_000,
  className = '',
}: ThumbnailImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [countdownProgress, setCountdownProgress] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);


  const updateBackground = () => {
    const newImageUrl = getNextThumbnailUrl(width, height);

    // Pre-load image to avoid flicker
    const img = new Image();

    // Reset loading state
    setIsLoading(true);

    img.onload = () => {
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setImageUrl(newImageUrl);
        setIsLoading(false);

        // Start countdown timer for next image change
        startCountdown();
      }
    };

    img.onerror = () => {
      // If loading fails, try a different seed
      if (mountedRef.current) {
        setIsLoading(false);
        // Use a fallback gradient instead of retrying to avoid potential loops
        setImageUrl('');

        // Start countdown even if image failed to load
        startCountdown();
      }
    };

    img.src = newImageUrl;
  };

  const startCountdown = () => {
    // Reset countdown progress
    setCountdownProgress(100);

    // Clear any existing countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Calculate update frequency to make animation smooth
    // Update about 20 times per second
    const updateFrequency = 50;
    const steps = interval / updateFrequency;
    const decrementPerStep = 100 / steps;

    countdownIntervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        setCountdownProgress(prev => {
          const newValue = Math.max(prev - decrementPerStep, 0);
          return newValue;
        });
      }
    }, updateFrequency);
  };

  useEffect(() => {
    // Set this ref to track if component is mounted
    mountedRef.current = true;

    // Initial load
    updateBackground();

    // Set interval for changing the background
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        updateBackground();
      }
    }, interval);

    // Cleanup function to prevent memory leaks and infinite loops
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [interval, width, height]); // Only re-run if these props change

  // Generate a fallback gradient as backup when image fails to load
  const fallbackGradient = `linear-gradient(135deg, hsla(var(--primary), 0.8) 0%, hsla(var(--accent), 0.8) 100%)`;

  return (
    <div
      className={`rounded-lg overflow-hidden  ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : fallbackGradient,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(4px)',
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      <div
        className="absolute bottom-0 right-0 h-1 bg-sunglow"
        style={{
          width: `${countdownProgress}%`,
          transition: 'width 0.05s linear'
        }}
      />
    </div>
  );
}

export default ThumbnailImage;
