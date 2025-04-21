import React from "react";
import Image from "next/image";
import { type Event, type Media as MediaType } from "@/payload-types"; // Import Event to extract block type
import { RichText } from "@/components/payload-cms/RichText";
import { cn } from "@/lib/utils";
import { getMediaUrl, getMediaAlt } from "@/lib/payload/payloadTypeAdapter";

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

  // Assert media type (assuming it's always MediaType for now)
  const mediaData = media as MediaType;
  const imageUrl = getMediaUrl(mediaData);
  const imageAlt = getMediaAlt(mediaData) || "Media item";

  if (!imageUrl) {
    return null; // Don't render if no image URL
  }

  // --- TODO: Implement video rendering if media type can be video --- //

  // Removed theme, background, position classes and logic

  return (
    // Use React.Fragment to avoid adding an extra div layer
    <React.Fragment>
      {/* Image container fills the space given by the parent */}
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover" // Use cover to fill the container
          sizes="100vw" // Simplified sizes, adjust if needed based on parent layout
        />
      </div>
      {caption && (
        // Basic caption styling, adjust as needed
        <figcaption className="absolute bottom-2 left-2 right-2 z-10 rounded bg-black/50 p-2 text-center text-xs text-white backdrop-blur-sm">
          <RichText
            data={caption} // Pass the RichText data directly
            className="prose prose-xs prose-invert max-w-none text-white"
          />
        </figcaption>
      )}
    </React.Fragment>
  );
};

export default MediaBlock; 