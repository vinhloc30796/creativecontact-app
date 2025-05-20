'use client';

import Link from "next/link";
import React from "react";
import { PlaceholderContactSwimLanePicture } from './PlaceholderContactSwimLanePicture';

interface ContactSwimLaneProps {
  contactId: string | number;
  profilePictureUrl?: string;
  name: string;
  role: string;
  location?: string;
  slug: string;
  rowIndex: number;
  tags?: string[];
}

export default function ContactSwimLane({
  contactId,
  profilePictureUrl,
  name,
  role,
  location,
  slug,
  rowIndex,
  tags,
}: ContactSwimLaneProps) {
  const isEven = rowIndex % 2 === 0;

  return (
    <Link
      href={`/user/${slug}`}
      className="group block w-full cursor-pointer border-t border-black py-6 first:border-t last:border-b hover:bg-white/10 hover:backdrop-blur-sm"
      aria-label={`View profile of ${name}`}
    >
      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 md:gap-6">
        <PlaceholderContactSwimLanePicture
          name={name}
          profilePictureUrl={profilePictureUrl}
          size={64}
          className="md:h-20 md:w-20"
        />

        <div className="flex flex-col">
          <span className="font-bricolage-grotesque group-hover:text-stroke-sunglow text-lg font-bold md:text-xl">
            {name}
          </span>
          <span className="text-sm text-foreground/70 md:text-base">
            {role}
          </span>
        </div>

        {location && (
          <div className="hidden text-right text-sm text-foreground/80 md:block">
            {location}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="hidden flex-wrap items-center justify-end gap-1 md:flex">
            {tags.slice(0, 3).map((tag, index) => {
              return (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-foreground"
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
