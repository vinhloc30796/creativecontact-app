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
      className="group block w-full cursor-pointer border-t border-black py-4 first:border-t last:border-b hover:bg-white/10 hover:backdrop-blur-sm"
      aria-label={`View profile of ${name}`}
    >
      <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1.5fr] items-center gap-4 px-4 md:gap-8">
        <div className="flex flex-col">
          <span className="font-bricolage-grotesque group-hover:text-stroke-sunglow text-lg font-semibold md:text-xl">
            {name}
          </span>
        </div>

        <div className="flex flex-col text-sm text-foreground/80 md:text-base">
          <span>{displayRole}</span>
        </div>

        {/* Replaced Tags with Industry Experiences */}
        <div className="hidden flex-wrap items-center justify-start gap-1 md:flex">
          {industryExperiences && industryExperiences.length > 0 && industryExperiences.slice(0, 2).map((exp, index) => { // Show max 2 experiences
            return (
              <span
                key={index}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {`${exp.industry} (${exp.experienceLevel})`}
              </span>
            );
          })}
        </div>

        {location && (
          <div className="hidden text-right text-sm text-foreground/80 md:block">
            {location}
          </div>
        )}

        <div className="hidden flex-wrap items-center justify-start gap-1 md:flex">
          {collaborationStatus && collaborationStatus.length > 0 && collaborationStatus.slice(0, 3).map((status, index) => {
            return (
              <span
                key={index}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {status}
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
}
