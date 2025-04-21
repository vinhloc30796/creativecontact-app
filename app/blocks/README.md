# Payload CMS Block Rendering Strategy

This document outlines the approach for dynamically rendering content blocks fetched from Payload CMS within the Next.js frontend application.

The core idea is to map the `blockType` defined in the Payload collection's `blocks` field to specific React components responsible for rendering that block's unique structure and data.

## 1. Individual Block Components

For each block defined in this directory (`app/blocks/*`), create a corresponding React component in the frontend codebase (e.g., under `components/blocks/`).

Each component will:

- Accept the specific block's data as a prop (typed according to the block's definition in Payload).
- Render the necessary HTML structure and styles (using Tailwind CSS, Shadcn UI components, etc.) for that block.

**Example (`components/blocks/EventDetailsBlock.tsx`):**

```tsx
import { EventDetails } from "@/payload-types"; // Assuming generated type
import { RichText } from "@/components/payload-cms/RichText";
import { H3, P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface EventDetailsBlockProps {
  data: Omit<EventDetails, "blockType" | "blockName">; // Exclude common block fields
}

export const EventDetailsBlock: React.FC<EventDetailsBlockProps> = ({
  data,
}) => {
  // Determine layout classes based on data.layout
  const layoutClasses = {
    default: "max-w-prose",
    wide: "max-w-4xl",
    fullWidth: "max-w-full",
  }[data.layout || "default"];

  return (
    <section className={cn("py-8", layoutClasses)}>
      {data.heading && <H3 className="mb-4">{data.heading}</H3>}
      {/* Assuming RichText component handles Payload's rich text format */}
      <RichText content={data.richText} />
      {/* Add logic for background image if needed */}
    </section>
  );
};
```

## 2. Central Renderer Component (`RenderBlocks`)

A central component (like the existing `@/components/payload-cms/RenderBlocks.tsx`) is responsible for iterating through the array of blocks received from the API (e.g., `event.content`) and rendering the correct individual block component for each item.

This component typically uses a map or a `switch` statement based on the `block.blockType`.

**Example Structure (`components/payload-cms/RenderBlocks.tsx`):**

```tsx
import React from "react";
import { BlockTypes } from "@/lib/payload/payloadTypeAdapter"; // Your adapted/generated block types union

// Import all individual block components
import { EventDetailsBlock } from "@/components/blocks/EventDetailsBlock";
import { EventSpeakerBlock } from "@/components/blocks/EventSpeakerBlock";
import { EventGalleryBlock } from "@/components/blocks/EventGalleryBlock";
// ... import other block components

interface RenderBlocksProps {
  blocks: BlockTypes[];
  className?: string;
}

export const RenderBlocks: React.FC<RenderBlocksProps> = ({
  blocks,
  className,
}) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        // Use block.id for key if available and stable, otherwise fallback to index
        const key = block.id || `block-${index}`;

        switch (block.blockType) {
          case "EventDetails":
            // Make sure the data passed matches the expected prop type
            // The 'block' object likely includes blockType and blockName, which might need omission
            return <EventDetailsBlock key={key} data={block} />;

          case "EventSpeaker":
            return <EventSpeakerBlock key={key} data={block} />;

          case "EventGallery":
            return <EventGalleryBlock key={key} data={block} />;

          // Add cases for all other defined block types
          // case 'EventCredits':
          //   return <EventCreditsBlock key={key} data={block} />;

          default:
            console.warn(
              `Block component not found for type: ${block.blockType}`,
            );
            // Optionally render a placeholder or nothing
            return (
              <div
                key={key}
                className="my-4 border border-dashed border-red-500 bg-red-100 p-4"
              >
                Block Component Missing: {block.blockType}
                <pre className="overflow-auto text-xs">
                  {JSON.stringify(block, null, 2)}
                </pre>
              </div>
            );
        }
      })}
    </div>
  );
};
```

## Usage

In your page components (like `app/(public)/events/[slug]/page.tsx`), you would fetch the data containing the blocks array and pass it to the `RenderBlocks` component:

```tsx
import { RenderBlocks } from "@/components/payload-cms/RenderBlocks";
import { fetchEventBySlug } from "@/lib/payload/fetchEvents";
import { BlockTypes } from "@/lib/payload/payloadTypeAdapter";
// ... other imports

export default async function EventPage({ params }) {
  const event = await fetchEventBySlug(params.slug);
  // ... null check

  const mainContentBlocks =
    (event.content?.filter(
      (block) => block.blockType !== "EventCredits",
    ) as BlockTypes[]) || []; // Ensure type assertion

  return (
    <main>
      {/* ... other page elements ... */}

      {/* Render the main content blocks */}
      <RenderBlocks blocks={mainContentBlocks} className="space-y-8" />

      {/* ... */}
    </main>
  );
}
```

By following this pattern, you can easily add new blocks or modify existing ones by creating/updating their respective components without changing the core rendering logic in `RenderBlocks`.

