"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { type Event, type Media as MediaType } from "@/payload-types"; // Import Event to extract block type
import { RichText } from "@/components/payload-cms/RichText";
import { cn } from "@/lib/utils";
import { getMediaUrl, getMediaAlt } from "@/lib/payload/payloadTypeAdapter";
import { ChevronUp, ChevronDown } from "lucide-react";

// Extract the specific block type from the Event content union type
// Note: The blockType is 'mediaBlock' in the payload config
type MediaBlockType = Extract<
  Event["content"][number],
  { blockType: "mediaBlock" }
>;

interface MediaBlockProps {
  // Use the nested mediaBlockFields data
  // Removed position and settings as they are no longer applied here
  data: Omit<MediaBlockType["mediaBlockFields"], "id" | "blockType" | "blockName" | "position" | "settings">;
}

export const MediaBlock: React.FC<MediaBlockProps> = ({ data }) => {
  const { media, caption } = data; // Removed position, settings
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChevron, setShowChevron] = useState(false);
  const [captionHeight, setCaptionHeight] = useState<string>("0px");
  const captionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Assert media type (assuming it's always MediaType for now)
  const mediaData = media as MediaType;
  const imageUrl = getMediaUrl(mediaData);
  const imageAlt = getMediaAlt(mediaData) || "Media item";

  // Extract intrinsic dimensions for Next Image. Provide sensible defaults as fallback.
  const intrinsicWidth = mediaData?.width ?? 1280;
  const intrinsicHeight = mediaData?.height ?? 720;

  useEffect(() => {
    if (captionRef.current && containerRef.current && caption) {
      // Show chevron if there's a caption (since it will be hideable)
      setShowChevron(true);

      // Calculate the smart height for expansion
      const contentHeight = captionRef.current.scrollHeight;
      const containerHeight = containerRef.current.clientHeight;
      const maxHeight = containerHeight * 0.25; // 25% of container
      const smartHeight = Math.min(contentHeight, maxHeight);

      setCaptionHeight(`${smartHeight}px`);
    }
  }, [caption, isExpanded]);

  if (!imageUrl) {
    return null; // Don't render if no image URL
  }

  // --- TODO: Implement video rendering if media type can be video --- //

  // Removed theme, background, position classes and logic

  return (
    // Use React.Fragment to avoid adding an extra div layer
    <React.Fragment>
      {/* Image container fills the space given by the parent */}
      <div
        ref={containerRef}
        className="flex h-full w-auto items-center justify-center overflow-hidden rounded-lg"
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={intrinsicWidth}
          height={intrinsicHeight}
          className="object-contain img-orientation max-h-full max-w-full"
        />
        {caption && (
          // Grey transparent overlay similar in style to EventDetailsBlock
          <figcaption
            className="absolute inset-x-0 bottom-0 z-10 bg-gray-900/60 backdrop-blur-sm rounded-b-lg transition-all duration-300 ease-in-out overflow-hidden"
            style={{
              height: isExpanded ? captionHeight : "0px"
            }}
          >
            {/* Caption Content */}
            <div
              ref={captionRef}
              className={cn(
                "p-4 h-full overflow-y-auto no-scrollbar",
                showChevron ? "pr-10" : "pr-4" // Only add right padding if chevron is shown
              )}
            >
              <RichText
                data={caption}
                className="prose prose-sm prose-invert max-w-none text-white [&_*]:!text-white [&_p]:!text-white"
              />
            </div>
          </figcaption>
        )}

        {/* Expand/Collapse Button - moved outside figcaption so it's always visible */}
        {showChevron && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute bottom-2 right-2 z-20 p-1 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            aria-label={isExpanded ? "Hide caption" : "Show caption"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-white" />
            ) : (
              <ChevronUp className="h-4 w-4 text-white" />
            )}
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export default MediaBlock; 