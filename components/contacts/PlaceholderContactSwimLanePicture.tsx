'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PlaceholderContactSwimLanePictureProps {
  name: string;
  profilePictureUrl?: string;
  size?: number;
  className?: string;
}

const DEFAULT_SIZE = 80;
const PLACEHOLDER_PROFILE_IMAGE = '/images/placeholder-profile.png';

const getRandomProfilePictureUrl = (size: number) => {
  const randomSeed = Math.floor(Math.random() * 1000);
  const timestamp = new Date().getTime();
  return `https://picsum.photos/seed/${randomSeed}/${size}/${size}?t=${timestamp}`;
};

export function PlaceholderContactSwimLanePicture({
  name,
  profilePictureUrl,
  size = DEFAULT_SIZE,
  className = '',
}: PlaceholderContactSwimLanePictureProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    PLACEHOLDER_PROFILE_IMAGE,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let targetUrl = PLACEHOLDER_PROFILE_IMAGE;

    if (profilePictureUrl) {
      targetUrl = process.env.NODE_ENV === 'production' && !profilePictureUrl.startsWith('http')
        ? `${process.env.NEXT_PUBLIC_APP_URL}${profilePictureUrl}`
        : profilePictureUrl;
    } else {
      targetUrl = getRandomProfilePictureUrl(size);
    }

    // Preload image logic
    const img = new window.Image();
    img.onload = () => {
      setCurrentImageUrl(targetUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      // If targetUrl (even if it was a picsum URL) fails, fallback to the definite placeholder
      setCurrentImageUrl(PLACEHOLDER_PROFILE_IMAGE);
      setIsLoading(false);
    };
    img.src = targetUrl;

  }, [profilePictureUrl, name, size]); // name is included to re-fetch for different contacts if no URL is provided

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          {/* Optional: add a spinner or skeleton loader here */}
        </div>
      )}
      <Image
        src={currentImageUrl}
        alt={`${name}'s profile picture`}
        fill
        className={`rounded-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        key={currentImageUrl} // Force re-render if src changes, helps with picsum images
      // The internal onError of Next/Image might also be useful, but preloading handles it well.
      />
    </div>
  );
}

export default PlaceholderContactSwimLanePicture;
