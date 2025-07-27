import React from "react";
import Image from "next/image";
import { type Event, type Media as MediaType } from "@/payload-types";
import { getMediaUrl, getMediaAlt } from "@/lib/payload/payloadTypeAdapter";
import MediaCaption from "./MediaCaption";

// Extract the specific block type from the Event content union type
// Note: The blockType is 'mediaBlock' in the payload config
type MediaBlockType = Extract<
  Event["content"][number],
  { blockType: "mediaBlock" }
>;

interface MediaBlockProps {
  // Use the nested mediaBlockFields data
  // Removed position and settings as they are no longer applied here
  data: Omit<
    MediaBlockType["mediaBlockFields"],
    "id" | "blockType" | "blockName" | "position" | "settings"
  >;
}

export const MediaBlock: React.FC<MediaBlockProps> = ({ data }) => {
  const { media, caption } = data;

  // Assert media type (assuming it's always MediaType for now)
  const mediaData = media as MediaType;
  const imageUrl = getMediaUrl(mediaData);
  const imageAlt = getMediaAlt(mediaData) || "Media item";

  // Extract intrinsic dimensions for Next Image. Provide sensible defaults as fallback.
  const intrinsicWidth = mediaData?.width ?? 1280;
  const intrinsicHeight = mediaData?.height ?? 720;

  if (!imageUrl) {
    return null; // Don't render if no image URL
  }

  // --- TODO: Implement video rendering if media type can be video --- //

  return (
    <div className="relative flex h-full w-auto items-center justify-center overflow-hidden rounded-lg">
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={intrinsicWidth}
        height={intrinsicHeight}
        className="object-contain img-orientation max-h-full max-w-full"
      />
      {caption && <MediaCaption caption={caption} />}
    </div>
  );
};

export default MediaBlock; 