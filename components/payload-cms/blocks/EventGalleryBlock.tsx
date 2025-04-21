import React from "react";
import { type Event, type Media as MediaType } from "@/payload-types";
import { H2, P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
// Import the individual Media block component
import { MediaBlock } from "./MediaBlock";

// Extract the specific block type from the Event content union type
type EventGalleryBlockType = Extract<
  Event["content"][number],
  { blockType: "EventGallery" }
>;

interface EventGalleryBlockProps {
  // Accept the full block data
  data: EventGalleryBlockType;
}

export const EventGalleryBlock: React.FC<EventGalleryBlockProps> = ({
  data,
}) => {
  const { heading, description, images } = data;

  if (!images || images.length === 0) {
    return null; // Don't render if no images
  }

  // Define base container classes for horizontal layout
  const containerClasses = cn(
    "flex flex-row gap-4 overflow-x-auto p-1", // Horizontal scroll, padding
    "scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent", // Basic scrollbar styling
  );

  // Note: The 'layout' and 'columns' props from EventGalleryBlock
  // are no longer used here for the main container layout.

  return (
    <section className="align-left relative flex h-full flex-col justify-end p-5">
      {/* Optional Heading and Description */}
      {(heading || description) && (
        <div className="mb-4 text-left">
          {heading && <H2 className="text-2xl font-semibold">{heading}</H2>}
          {description && (
            <P className="text-muted-foreground mt-1">{description}</P>
          )}
        </div>
      )}

      {/* Horizontal Container for Media Blocks */}
      <div className={containerClasses}>
        {images.map((imgItem, index) => {
          // Ensure 'image' is treated as MediaType or undefined/null
          const media = imgItem.image as MediaType | null | undefined;

          if (!media) return null; // Skip if media object is invalid

          // Prepare data for individual MediaBlock
          // The MediaBlock expects data conforming to MediaBlockFields inside the block
          // but without id, blockType, blockName. We create that structure here.
          const mediaBlockData = {
            media: media,
            // Pass caption only if it's already RichText, otherwise undefined
            // A more robust solution would involve converting string captions to RichText
            caption: typeof imgItem.caption === 'object' && imgItem.caption !== null ? imgItem.caption : undefined,
            position: 'default' as const, // Default position, MediaBlock can override
            // settings: {} // Pass settings if available on imgItem
          };

          return (
            <div key={imgItem.id || index} className="flex-shrink-0 w-72 md:w-96"> {/* Control width of each media card */}
              {/* Render MediaBlock with structured data */}
              <MediaBlock data={mediaBlockData} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EventGalleryBlock;
