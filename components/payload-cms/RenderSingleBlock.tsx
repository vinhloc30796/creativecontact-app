import React from "react";
import { BlockTypes } from "@/lib/payload/payloadTypeAdapter"; // Adapt if necessary

// Import individual block components (add all needed components here)
import { EventDetailsBlock } from "@/components/payload-cms/blocks/EventDetailsBlock";
import { EventSpeakerBlock } from "@/components/payload-cms/blocks/EventSpeakerBlock";
// import { EventGalleryBlock } from "@/components/blocks/EventGalleryBlock";
// import { EventCreditsBlock } from "@/components/blocks/EventCreditsBlock";
// ... import other block components

interface RenderSingleBlockProps {
  block: BlockTypes; // Type for a single block
}

/**
 * Renders a single Payload CMS block based on its blockType.
 * Used when blocks need individual containers (e.g., sliders, scroll sections).
 */
export const RenderSingleBlock: React.FC<RenderSingleBlockProps> = ({ block }) => {
  // Use block.id if available for key consistency, though key is applied in the parent map
  const key = block.id || JSON.stringify(block); // Fallback key

  switch (block.blockType) {
    case "EventDetails":
      // Ensure data passed matches the component's expected props (Omit<> might be needed)
      return <EventDetailsBlock data={block} />;

    case "EventSpeaker":
      return <EventSpeakerBlock data={block} />;

    // case "EventGallery":
    //   return <EventGalleryBlock data={block} />;

    // case "EventCredits":
    //   return <EventCreditsBlock data={block} />;

    // Add cases for all other defined block types

    default:
      console.warn(
        `RenderSingleBlock: Component not found for block type: ${block.blockType}`,
      );
      // Render a fallback or placeholder for unmapped blocks
      return (
        <div
          key={key} // Ensure key is present even on fallback
          className="p-4 my-4 border border-dashed border-yellow-500 bg-yellow-100"
        >
          Missing Component for Block: {block.blockType}
          <pre className="mt-2 text-xs overflow-auto bg-neutral-200 p-2 rounded">
            {JSON.stringify(block, null, 2)}
          </pre>
        </div>
      );
  }
};

export default RenderSingleBlock; 