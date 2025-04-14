"use client";

import {
  BlockTypes
} from "@/lib/payload/payloadTypeAdapter";

// Import all individual block components
import { EventCreditsBlock as EventCreditsBlockComponent } from "@/components/payload-cms/blocks/EventCreditsBlock";
import { EventDetailsBlock as EventDetailsBlockComponent } from "@/components/payload-cms/blocks/EventDetailsBlock";
import { EventGalleryBlock as EventGalleryBlockComponent } from "@/components/payload-cms/blocks/EventGalleryBlock";
import { EventSpeakerBlock as EventSpeakerBlockComponent } from "@/components/payload-cms/blocks/EventSpeakerBlock";
import { EventSpeakersBlock as EventSpeakersBlockComponent } from "@/components/payload-cms/blocks/EventSpeakersBlock";
import { MediaBlock as MediaBlockComponent } from "@/components/payload-cms/blocks/MediaBlock";
// ... import other block components

// Use the types from our adapter
interface RenderBlocksProps {
  blocks: BlockTypes[];
}

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  return (
    <div className="flex flex-col gap-16">
      {blocks.map((block, index) => {
        // Render different blocks based on their blockType
        switch (block.blockType) {
          case "EventDetails":
            return <EventDetailsBlockComponent key={index} data={block} />;
          case "EventSpeaker":
            return <EventSpeakerBlockComponent key={index} data={block} />;
          case "EventSpeakers":
            return <EventSpeakersBlockComponent key={index} data={block} />;
          case "EventGallery":
            return <EventGalleryBlockComponent key={index} data={block} />;
          case "EventCredits":
            return <EventCreditsBlockComponent key={index} data={block} />;
          case "mediaBlock":
            return <MediaBlockComponent key={index} data={block.mediaBlockFields} />;
          default:
            // For unrecognized blocks or debugging
            return (
              <div
                key={index}
                className="rounded-md border border-dashed border-gray-300 p-4"
              >
                <p className="text-muted-foreground">
                  Unsupported block type: {(block as any).blockType}
                </p>
              </div>
            );
        }
      })}
    </div>
  );
}
