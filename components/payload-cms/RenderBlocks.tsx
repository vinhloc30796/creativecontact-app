"use client";

import { BlockTypes } from "@/lib/payload/payloadTypeAdapter";
import { RenderSingleBlock } from "@/components/payload-cms/RenderSingleBlock";
import { cn } from "@/lib/utils";

// Use the types from our adapter
interface RenderBlocksProps {
  blocks: BlockTypes[];
  className?: string;
}

export function RenderBlocks({ blocks, className }: RenderBlocksProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-full gap-4 overflow-x-auto pl-4 scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {blocks.map((block, index) => (
        <div
          key={block.id || `flat-block-${index}`}
          className={cn(
            "h-full flex-shrink-0 snap-start rounded-xl last:mr-4",
            block.blockType === "mediaBlock"
              ? "aspect-video bg-transparent p-0"
              : "aspect-square bg-black/10 p-5",
          )}
        >
          {block.blockType === "mediaBlock" ? (
            <RenderSingleBlock block={block} />
          ) : (
            <div className="bg-gray/40 h-full rounded-lg p-6 backdrop-blur-md">
              <RenderSingleBlock block={block} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
