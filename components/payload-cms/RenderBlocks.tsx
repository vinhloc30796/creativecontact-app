"use client";

import { BlockTypes } from "@/lib/payload/payloadTypeAdapter";
import { RenderSingleBlock } from "@/components/payload-cms/RenderSingleBlock";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

// Use the types from our adapter
interface RenderBlocksProps {
  blocks: BlockTypes[];
  className?: string;
  hideOnScroll?: boolean;
}

export function RenderBlocks({ blocks, className, hideOnScroll = false }: RenderBlocksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (hideOnScroll && el) {
      const handleScroll = () => setIsHidden(el.scrollLeft > 0);
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [hideOnScroll]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scrollbar-hide relative z-10 flex h-full gap-4 overflow-x-auto p-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
        hideOnScroll
          ? isHidden
            ? "opacity-0 transition-opacity duration-300 ease-in-out"
            : "opacity-100 transition-opacity duration-300 ease-in-out"
          : undefined
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
