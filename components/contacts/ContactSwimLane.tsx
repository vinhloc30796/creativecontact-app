'use client';

import Link from "next/link";
import React from "react";
// Import UserContactView as it will be extended
import type { UserContactView } from "@/app/api/users/helper";
// PlaceholderContactSwimLanePicture is not used, consider removing if truly unused.
// import { PlaceholderContactSwimLanePicture } from './PlaceholderContactSwimLanePicture';

// Streamlined props: extends UserContactView and adds component-specific props
interface ContactSwimLaneProps extends UserContactView {
  rowIndex: number;
  // Add any other props specific to ContactSwimLane here if they arise
  // For example, if we needed a variant: variant?: 'default' | 'compact';
}

export default function ContactSwimLane(props: ContactSwimLaneProps) {
  // Destructure all needed props from the extended UserContactView and specific props
  const {
    // Fields from UserContactView
    contactId, // Note: contactId is in UserContactView, but not directly used in Link's key here. Key is on map.
    profilePictureUrl,
    name,
    role,
    location,
    slug,
    industryExperiences,
    collaborationStatus,
    // tags, // This was removed earlier, ensure UserContactView also reflects this if it's truly gone

    // Component-specific props
    rowIndex,
  } = props;

  // const isEven = rowIndex % 2 === 0; // isEven is not used, can be removed if not needed

  // Provide fallbacks for potentially null values
  const displayRole = role || "N/A";
  const linkSlug = slug || "#";

  return (
    <Link
      href={`/user/${linkSlug}`}
      /*
       * Consistent row height
       *  - `h-20` (~80px) on small screens
       *  - `md:h-24` (~96px) on medium+ screens
       */
      className="group block w-full cursor-pointer border-t border-black first:border-t last:border-b hover:bg-white/10 hover:backdrop-blur-sm px-0 py-3 my-2"
      style={{ height: "calc(5lh + 1.5rem)" }}
      aria-label={`View profile of ${name}`}
    >
      {/*
        * Internal grid – top-aligned items instead of vertically centred
        */}
      <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1.5fr] items-start gap-4 px-4 md:gap-8">
        <div className="flex flex-col">
          <span className="font-plus-jakarta-sans text-lg font-semibold md:text-xl transition-colors group-hover:text-black group-hover:font-bricolage-grotesque">
            {name}
          </span>
        </div>

        <div className="flex flex-col pt-0.5 text-sm text-foreground/80">
          <span className="font-medium">{displayRole}</span>
        </div>

        {/* Industry / experience pairs – stacked, with overflow clipping */}
        <div className="hidden h-full overflow-hidden md:flex md:flex-col md:gap-1">
          {industryExperiences?.map((exp, index) => (
            <span
              key={index}
              className="block w-fit rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-sm font-medium text-foreground"
            >
              {`${exp.industry} (${exp.experienceLevel})`}
            </span>
          ))}
        </div>

        {location && (
          <div className="hidden pt-0.5 text-right text-sm font-medium text-foreground/80 md:block">
            {location}
          </div>
        )}

        {/* Collaboration status – stacked like industry tags */}
        <div className="hidden h-full overflow-hidden md:flex md:flex-col md:gap-1">
          {collaborationStatus?.map((status, index) => (
            <span
              key={index}
              className="block w-fit rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-sm font-medium text-foreground"
            >
              {status}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
