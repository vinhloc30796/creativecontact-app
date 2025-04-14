import React from "react";
import { BlockTypes } from "@/lib/payload/payloadTypeAdapter"; // Media type no longer needed here

// Import individual block components (add all needed components here)
import { EventDetailsBlock } from "@/components/payload-cms/blocks/EventDetailsBlock";
import { EventSpeakerBlock } from "@/components/payload-cms/blocks/EventSpeakerBlock";
// We might need EventSpeakersBlock again if used elsewhere, keep import for now or handle specific blocks
import { EventSpeakersBlock } from "@/components/payload-cms/blocks/EventSpeakersBlock";
import { EventGalleryBlock } from "@/components/payload-cms/blocks/EventGalleryBlock";
import { EventCreditsBlock } from "@/components/payload-cms/blocks/EventCreditsBlock";
// ... import other block components
import { MediaBlock } from "@/components/payload-cms/blocks/MediaBlock";

interface RenderSingleBlockProps {
  block: BlockTypes; // Type for a single block
}

/**
 * Renders a single Payload CMS block based on its blockType.
 * Used when blocks need individual containers (e.g., sliders, scroll sections).
 */
export const RenderSingleBlock: React.FC<RenderSingleBlockProps> = ({ block }) => {
  // Use block.id if available for key consistency, though key is applied in the parent map
  const key = block.id || JSON.stringify(block); // Key is now applied in the parent map

  switch (block.blockType) {
    case "EventDetails":
      // Ensure data passed matches the component's expected props
      return <EventDetailsBlock data={block} />;

    case "EventSpeaker":
      // Pass the correct props
      return <EventSpeakerBlock data={block} />;

    case "EventSpeakers":
      // Revert: If RenderSingleBlock encounters an EventSpeakers block directly
      // (e.g., if not flattened by the parent), use the (now very simple)
      // EventSpeakersBlock component which just maps internally.
      // Or, potentially return null/error if flattening is always expected.
      // For now, let's assume EventSpeakersBlock handles its rendering.
      // return <EventSpeakersBlock data={block} />; // Keep previous simple delegation
      // OR - If flattening is always expected, this case might be an error/fallback:
      console.warn("RenderSingleBlock encountered EventSpeakers block unexpectedly. Flattening is expected in parent.");
      return null; // Or render a placeholder

    case "EventGallery":
      return <EventGalleryBlock data={block} />;

    case "EventCredits":
      return <EventCreditsBlock data={block} />;

    case "mediaBlock":
      // Pass the nested fields if using MediaBlock directly
      return <MediaBlock data={block.mediaBlockFields} />;

    // Add cases for all other defined block types

    default:
      console.warn(
        `RenderSingleBlock: Component not found for block type: ${(block as any).blockType}`,
      );
      // Render a fallback or placeholder for unmapped blocks
      return (
        <div
          key={key} // Add key back for fallback
          className="p-4 my-4 border border-dashed border-yellow-500 bg-yellow-100"
        >
          Missing Component for Block: {(block as any).blockType}
          <pre className="mt-2 text-xs overflow-auto bg-neutral-200 p-2 rounded">
            {JSON.stringify(block, null, 2)}
          </pre>
        </div>
      );
  }
};

export default RenderSingleBlock; 